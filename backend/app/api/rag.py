import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, Dict, Any

from app.schemas.document import RAGQueryRequest, RAGQueryResponse
from app.services.rag_service import search_relevant_chunks, generate_grounded_answer
from app.api.auth_deps import get_current_user_id

router = APIRouter(prefix="/api/rag", tags=["rag"])
logger = logging.getLogger("edumitra.api.rag")

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
