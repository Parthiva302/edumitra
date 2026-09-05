import uuid
import logging
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import Optional, List, Dict, Any

from app.database.supabase import (
    get_supabase,
    create_material,
    get_user_materials,
    get_document_by_id,
    delete_material_by_id,
    record_learning_history
)
from app.services.document_processor import process_document_end_to_end
from app.api.auth_deps import get_current_user_id

router = APIRouter(tags=["documents"])
logger = logging.getLogger("edumitra.api.documents")

async def _handle_document_upload(file: UploadFile, user_id: str):
    supabase = get_supabase()
    file_bytes = await file.read()
    file_name = file.filename or "uploaded_document.pdf"
    file_size_bytes = len(file_bytes)
    file_size_mb = round(file_size_bytes / (1024 * 1024), 2)
    file_size_str = f"{file_size_mb} MB" if file_size_mb >= 0.1 else f"{round(file_size_bytes/1024, 1)} KB"
    
    ext = file_name.split(".")[-1].upper() if "." in file_name else "PDF"
    file_type = ext if ext in ["PDF", "DOC", "DOCX", "PPT", "PPTX", "TXT", "MD"] else "PDF"
    document_id = str(uuid.uuid4())
    storage_path = f"{user_id}/{document_id}_{file_name}"

    # 1. Upload to Supabase Storage if bucket exists
    file_url = None
    try:
        supabase.storage.from_("materials").upload(
            path=storage_path,
            file=file_bytes,
            file_options={"content-type": file.content_type or "application/octet-stream"}
        )
        file_url = f"{storage_path}"
    except Exception as se:
        logger.warning(f"Storage upload notice: {se}")

    # 2. Insert record in database
    doc_record = {
        "id": document_id,
        "user_id": user_id,
        "filename": file_name,
        "file_name": file_name,
        "file_type": file_type,
        "file_size": file_size_bytes,
        "file_url": file_url,
        "storage_path": storage_path,
        "title": file_name.replace(f".{ext.lower()}", "").replace("_", " ").title(),
        "description": "Uploaded educational material.",
        "processing_status": "processing",
        "processing_error": None
    }
    create_material(doc_record)

    # 3. Process document end-to-end (extract text, analyze structure, chunk, embed in pgvector)
    proc_result = process_document_end_to_end(
        material_id=document_id,
        user_id=user_id,
        file_bytes=file_bytes,
        file_name=file_name,
        file_type=file_type
    )

    # 4. Record in learning history
    record_learning_history({
        "user_id": user_id,
        "topic": proc_result.get("title", file_name),
        "action": "material_uploaded",
        "metadata": {
            "document_id": document_id,
            "file_name": file_name,
            "chunks_count": proc_result.get("chunks_count", 0),
            "key_concepts": proc_result.get("key_concepts", [])
        }
    })

    return {
        "id": document_id,
        "document_id": document_id,
        "filename": file_name,
        "name": file_name,
        "title": proc_result.get("title", file_name),
        "file_type": file_type,
        "type": file_type,
        "size": file_size_str,
        "total_pages": max(1, proc_result.get("sections_count", 1)),
        "pages": max(1, proc_result.get("sections_count", 1)),
        "uploaded_at": "Just now",
        "uploadedAt": "Just now",
        "processing_status": "indexed",
        "status": "ready",
        "key_concepts": proc_result.get("key_concepts", []),
        "keyConceptsExtracted": proc_result.get("key_concepts", []),
        "summary": proc_result.get("structure", {}).get("summary", ""),
        "chunks_count": proc_result.get("chunks_count", 0)
    }

# POST /api/documents/upload & POST /api/materials/upload
@router.post("/api/documents/upload")
@router.post("/api/materials/upload")
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    """Upload educational document (PDF, DOCX, PPTX, TXT, MD), semantic chunking, and pgvector embeddings"""
    try:
        return await _handle_document_upload(file, user_id)
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# GET /api/documents & GET /api/materials
@router.get("/api/documents")
@router.get("/api/materials")
def list_user_documents(user_id: str = Depends(get_current_user_id)):
    """List all educational documents uploaded by the student"""
    materials = get_user_materials(user_id)
    result = []
    for m in materials:
        result.append({
            "id": m.get("id"),
            "filename": m.get("filename") or m.get("file_name"),
            "name": m.get("filename") or m.get("file_name"),
            "title": m.get("title") or m.get("file_name") or "Document",
            "file_type": m.get("file_type") or "PDF",
            "type": m.get("file_type") or "PDF",
            "size": m.get("file_size") or "1.5 MB",
            "total_pages": m.get("total_pages", 5),
            "pages": m.get("total_pages", 5),
            "uploaded_at": m.get("created_at", "Recently"),
            "uploadedAt": m.get("created_at", "Recently"),
            "processing_status": m.get("processing_status", "indexed"),
            "status": "ready" if m.get("processing_status") in ["indexed", "ready"] else m.get("processing_status", "ready"),
            "keyConceptsExtracted": ["Core Principles", "Formulas & Derivations", "Practical Scenarios"],
            "summary": m.get("description", "")
        })
    return result

# GET /api/documents/{id} & GET /api/materials/{id}
@router.get("/api/documents/{document_id}")
@router.get("/api/materials/{document_id}")
def get_document_details(
    document_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Get metadata and indexed structure for a specific document"""
    doc = get_document_by_id(document_id, user_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return {
        "id": doc.get("id"),
        "filename": doc.get("filename") or doc.get("file_name"),
        "title": doc.get("title"),
        "file_type": doc.get("file_type"),
        "processing_status": doc.get("processing_status", "indexed"),
        "total_pages": doc.get("total_pages", 1),
        "created_at": doc.get("created_at")
    }

# Query RAG on a specific document
@router.post("/api/documents/{document_id}/query")
@router.post("/api/materials/{document_id}/query")
def query_document_rag(
    document_id: str,
    payload: Dict[str, Any],
    user_id: str = Depends(get_current_user_id)
):
    """Direct semantic search and grounded answering for a specific document"""
    try:
        from app.services.rag_service import generate_grounded_answer
        query_text = payload.get("query", "")
        result = generate_grounded_answer(
            query=query_text,
            user_id=user_id,
            material_id=document_id
        )
        return result
    except Exception as e:
        logger.error(f"Error querying document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# DELETE /api/documents/{id} & DELETE /api/materials/{id}
@router.delete("/api/documents/{document_id}")
@router.delete("/api/materials/{document_id}")
def delete_document(
    document_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Delete a document and all associated chunks"""
    try:
        delete_material_by_id(document_id, user_id)
        return {"success": True, "deleted_id": document_id}
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))
