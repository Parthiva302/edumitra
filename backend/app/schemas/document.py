from typing import Optional, List, Dict, Any
from pydantic import BaseModel

class MaterialItem(BaseModel):
    id: str
    user_id: str
    file_name: str
    file_type: Optional[str] = None
    file_size: Optional[str] = None
    storage_path: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    processing_status: str = "pending"
    processing_error: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    key_concepts: List[str] = []

class ProcessMaterialRequest(BaseModel):
    material_id: str

class ProcessMaterialResponse(BaseModel):
    success: bool
    material_id: str
    file_name: str
    title: str
    chapters_count: int
    sections_count: int
    chunks_count: int
    key_concepts: List[str]
    processing_status: str
    error: Optional[str] = None

class RAGQueryRequest(BaseModel):
    query: str
    material_id: Optional[str] = None
    top_k: int = 4

class RAGQueryResponse(BaseModel):
    query: str
    retrieved_chunks: List[Dict[str, Any]]
    grounded_context: str
    source_references: List[Dict[str, Any]]
