import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any, List

from app.schemas.document import RAGQueryRequest, RAGQueryResponse
from app.services.rag_service import search_relevant_chunks, generate_grounded_answer
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/rag", tags=["rag"])
logger = logging.getLogger("edumitra.api.rag")

@router.post("/search")
def search_vector_chunks(
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """
    Search pgvector embeddings for semantically similar document chunks.
    Input: query, document_id (optional), top_k, similarity_threshold
    Returns: content, document_id, page_number, chapter, section, similarity score
    """
    try:
        query = payload.get("query") or payload.get("query_text", "")
        document_id = payload.get("document_id") or payload.get("material_id")
        top_k = int(payload.get("top_k", 5))

        chunks = search_relevant_chunks(
            query=query,
            user_id=user_id,
            material_id=document_id,
            top_k=top_k
        )

        formatted = []
        for c in chunks:
            meta = c.get("metadata", {})
            formatted.append({
                "content": c.get("content", ""),
                "document_id": c.get("material_id") or c.get("document_id"),
                "page_number": c.get("page_number", meta.get("page_number", 1)),
                "chapter": c.get("chapter", meta.get("chapter", "")),
                "section": c.get("section", meta.get("section", "")),
                "similarity": round(float(c.get("similarity", 0.0)), 4)
            })

        return {
            "query": query,
            "results_count": len(formatted),
            "results": formatted
        }
    except Exception as e:
        logger.error(f"Error in RAG search: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
def query_rag(
    payload: RAGQueryRequest,
    user_id: str = Depends(get_current_user_id)
):
    """Semantic RAG retrieval and grounded generation from user educational materials"""
    try:
        result = generate_grounded_answer(
            query=payload.query,
            user_id=user_id,
            material_id=payload.material_id
        )
        return result
    except Exception as e:
        logger.error(f"Error in RAG query: {e}")
        raise HTTPException(status_code=500, detail=str(e))
