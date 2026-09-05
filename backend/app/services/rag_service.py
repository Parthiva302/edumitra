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
    
    if not retrieved or retrieved[0].get("similarity", 0) <= 0.05:
        # Strictly follow data given by the student only: do not hallucinate outside uploaded material
        return {
            "query": query,
            "answer": "Your uploaded material does not contain enough information to answer this question. To guarantee academic accuracy and prevent misinformation, EduMitra only answers based strictly on the documents and notes you upload.",
            "grounded": False,
            "retrieved_chunks": [],
            "source_references": []
        }

    context_blocks = []
    sources = []
    for i, c in enumerate(retrieved):
        doc_name = c.get("metadata", {}).get("file_name", "Uploaded Material")
        page_num = c.get("page_number") or c.get("metadata", {}).get("page_number", 1)
        chapter = c.get("chapter") or c.get("metadata", {}).get("chapter", "")
        section = c.get("section") or c.get("metadata", {}).get("section", "")
        
        header = f"[Source {i+1}: {doc_name}"
        if chapter:
            header += f" | {chapter}"
        if section:
            header += f" - {section}"
        header += f" (Page {page_num})]:"
        
        context_blocks.append(f"{header}\n{c['content']}")
        sources.append({
            "source_index": i + 1,
            "file_name": doc_name,
            "page_number": page_num,
            "chapter": chapter,
            "section": section,
            "similarity": round(c["similarity"], 3),
            "snippet": c["content"][:150] + "..."
        })

    combined_context = "\n\n".join(context_blocks)
    
    rag_prompt = f"""
STRICT GROUNDING DIRECTIVE:
You are an AI Teacher answering the student's question SOLELY and EXCLUSIVELY using their provided uploaded study material below.
Follow these mandatory constraints:
1. STRICT BOUNDARY: Base your answer ENTIRELY on the student's uploaded content provided in the context.
2. ZERO HALLUCINATION: Do NOT introduce external facts, concepts, definitions, or equations that are not present in or directly provable from the student's uploaded text.
3. CLEAR CITATION: Cite the document title and page/chapter numbers when explaining definitions or rules.
4. If the student's uploaded material does not contain enough details to fully answer a part of their question, explicitly tell the student that their uploaded material does not cover that specific aspect.

Student's Uploaded Material:
{combined_context}

Student Question / Topic:
{query}

Language: {language}
"""
    try:
        answer_text = generate_text(
            rag_prompt,
            system_instruction=(
                "You are EduMitra, a strict pedagogical AI Teacher. You ground all explanations "
                "strictly and exclusively in the student's uploaded text. Never hallucinate or add facts outside the text."
            )
        )
    except Exception as e:
        logger.warning(f"RAG LLM synthesis error (fallback to chunk synthesis): {e}")
        top_snippet = retrieved[0]["content"] if retrieved else "Key principles from your notes."
        answer_text = f"Based strictly on your uploaded material:\n\n{top_snippet}\n\nThis material directly addresses your inquiry based solely on your provided notes."
    
    return {
        "query": query,
        "answer": answer_text,
        "grounded": True,
        "retrieved_chunks": retrieved,
        "source_references": sources
    }
