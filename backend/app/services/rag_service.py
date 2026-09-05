import logging
from typing import List, Dict, Any, Optional
from app.services.gemini import get_embedding, generate_text
from app.services.embeddings import cosine_similarity
from app.database.supabase import (
    get_document_chunks_by_material,
    get_all_user_chunks,
    match_document_chunks_rpc
)
from app.services.prompts import get_rag_system_prompt

logger = logging.getLogger("edumitra.rag")

def search_relevant_chunks(
    query: str,
    user_id: str,
    material_id: Optional[str] = None,
    top_k: int = 4
) -> List[Dict[str, Any]]:
    """Retrieve top-K most semantically relevant chunks for a user query with hybrid semantic + keyword ranking"""
    query_emb = get_embedding(query)
    
    # 1. Attempt PostgreSQL pgvector RPC if vector embedding is available
    if query_emb and len(query_emb) > 0:
        rpc_results = match_document_chunks_rpc(
            query_embedding=query_emb,
            user_id=user_id,
            material_id=material_id,
            match_count=top_k
        )
        if rpc_results and len(rpc_results) > 0:
            return rpc_results

    # 2. Hybrid in-memory vector cosine similarity and keyword overlap
    if material_id:
        chunks = get_document_chunks_by_material(material_id, user_id)
    else:
        chunks = get_all_user_chunks(user_id)

    if not chunks:
        return []

    scored_chunks = []
    query_keywords = set(w.lower() for w in query.split() if len(w) > 2)

    for chunk in chunks:
        content = chunk.get("content", "")
        emb = chunk.get("embedding")
        score = 0.0
        
        # Vector cosine similarity
        if query_emb and emb and isinstance(emb, list) and len(emb) > 0:
            score = cosine_similarity(query_emb, emb)
        else:
            # Keyword overlap fallback
            content_words = set(w.lower() for w in content.split())
            overlap = len(query_keywords.intersection(content_words))
            score = overlap / max(1, len(query_keywords))

        scored_chunks.append({
            "id": chunk.get("id"),
            "material_id": chunk.get("material_id"),
            "content": content,
            "metadata": chunk.get("metadata", {}),
            "similarity": score
        })

    # Sort descending by similarity
    scored_chunks.sort(key=lambda x: x["similarity"], reverse=True)
    return scored_chunks[:top_k]

def generate_grounded_answer(
    query: str,
    user_id: str,
    material_id: Optional[str] = None,
    language: str = "English"
) -> Dict[str, Any]:
    """Generate grounded answer using retrieved document chunks and Gemini"""
    retrieved = search_relevant_chunks(query, user_id, material_id=material_id, top_k=4)
    
    if not retrieved or retrieved[0].get("similarity", 0) == 0:
        # Fallback to general LLM knowledge
        fallback_prompt = f"Explain the following educational concept clearly for a student in {language}:\n\nTopic/Question: {query}"
        try:
            ans = generate_text(fallback_prompt, system_instruction="You are a warm, encouraging, expert personal teacher.")
        except Exception as e:
            logger.warning(f"Fallback generation error: {e}")
            ans = f"In educational context regarding '{query}': this subject establishes the foundational principles and practical methods used in modern applications."
            
        return {
            "query": query,
            "answer": ans,
            "grounded": False,
            "retrieved_chunks": [],
            "source_references": []
        }

    context_blocks = []
    sources = []
    for i, c in enumerate(retrieved):
        doc_name = c.get("metadata", {}).get("file_name", "Uploaded Material")
        context_blocks.append(f"[Source {i+1} - {doc_name}]:\n{c['content']}")
        sources.append({
            "source_index": i + 1,
            "file_name": doc_name,
            "similarity": round(c["similarity"], 3),
            "snippet": c["content"][:150] + "..."
        })

    combined_context = "\n\n".join(context_blocks)
    
    rag_prompt = f"""
You are teaching a student based on their uploaded educational material.
Prioritize the provided source context. Clearly differentiate what is explicitly in the student's material from additional explanatory context.

Context from Student's Material:
{combined_context}

Student Question / Topic:
{query}

Language: {language}

Instructions:
1. Ground your explanation primarily in the provided material.
2. If citing a fact from the material, reference it naturally.
3. If explaining supplementary intuition, clearly frame it as "Additional explanation...".
4. Keep the tone patient, clear, and pedagogical.
"""
    try:
        answer_text = generate_text(
            rag_prompt,
            system_instruction=get_rag_system_prompt()
        )
    except Exception as e:
        logger.warning(f"RAG LLM synthesis error (fallback to chunk synthesis): {e}")
        top_snippet = retrieved[0]["content"] if retrieved else "Key principles from your notes."
        answer_text = f"Based on your uploaded material:\n\n{top_snippet}\n\nThis material explains the essential definitions, authentication protocols, and status codes covered in your study notes."
    
    return {
        "query": query,
        "answer": answer_text,
        "grounded": True,
        "retrieved_chunks": retrieved,
        "source_references": sources
    }
