import logging
from typing import Optional, Dict, Any, List
from supabase import create_client, Client
from app.config import settings

logger = logging.getLogger("edumitra.database")

_supabase_client: Optional[Client] = None

def get_supabase() -> Client:
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment.")
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        logger.info("Supabase client successfully initialized.")
    # Always guarantee PostgREST client retains the admin service_role authorization
    _supabase_client.postgrest.auth(settings.SUPABASE_SERVICE_ROLE_KEY)
    return _supabase_client

def get_auth_client() -> Client:
    """Returns an isolated Supabase client for user auth operations so the service client is never polluted"""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment.")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

# Profile operations
def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("profiles").select("*").eq("id", user_id).execute()
    return res.data[0] if res.data else None

def upsert_user_profile(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    supabase = get_supabase()
    res = supabase.table("profiles").upsert(profile_data).execute()
    return res.data[0] if res.data else profile_data

# Materials operations
def get_user_materials(user_id: str) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("materials").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return res.data or []

def create_material(material_data: Dict[str, Any]) -> Dict[str, Any]:
    supabase = get_supabase()
    res = supabase.table("materials").insert(material_data).execute()
    return res.data[0] if res.data else material_data

def delete_material_by_id(material_id: str, user_id: str) -> bool:
    supabase = get_supabase()
    # Delete chunks first
    supabase.table("document_chunks").delete().eq("material_id", material_id).eq("user_id", user_id).execute()
    supabase.table("document_sections").delete().eq("material_id", material_id).eq("user_id", user_id).execute()
    supabase.table("materials").delete().eq("id", material_id).eq("user_id", user_id).execute()
    return True

# Document Chunks / Sections operations
def insert_document_sections(sections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not sections:
        return []
    supabase = get_supabase()
    res = supabase.table("document_sections").insert(sections).execute()
    return res.data or []

def insert_document_chunks(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not chunks:
        return []
    supabase = get_supabase()
    res = supabase.table("document_chunks").insert(chunks).execute()
    return res.data or []

def get_document_chunks_by_material(material_id: str, user_id: str) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("document_chunks").select("*").eq("material_id", material_id).eq("user_id", user_id).execute()
    return res.data or []

def get_all_user_chunks(user_id: str) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("document_chunks").select("*").eq("user_id", user_id).execute()
    return res.data or []

def match_document_chunks_rpc(
    query_embedding: List[float],
    user_id: str,
    material_id: Optional[str] = None,
    match_count: int = 5
) -> List[Dict[str, Any]]:
    """Execute PostgreSQL RPC vector similarity search if pgvector extension is active"""
    try:
        supabase = get_supabase()
        params = {
            "query_embedding": query_embedding,
            "match_threshold": 0.3,
            "match_count": match_count,
            "p_user_id": user_id,
            "p_material_id": material_id
        }
        res = supabase.rpc("match_document_chunks", params).execute()
        return res.data or []
    except Exception as e:
        logger.debug(f"RPC match_document_chunks not available or failed: {e}")
        return []

# Lessons operations
def get_user_lessons(user_id: str) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("lessons").select("*, lesson_steps(*)").eq("user_id", user_id).order("updated_at", desc=True).execute()
    return res.data or []

def get_in_progress_lesson(user_id: str) -> Optional[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("lessons").select("*, lesson_steps(*)").eq("user_id", user_id).eq("status", "in_progress").order("updated_at", desc=True).limit(1).execute()
    return res.data[0] if res.data else None

def upsert_lesson(lesson_data: Dict[str, Any]) -> Dict[str, Any]:
    supabase = get_supabase()
    res = supabase.table("lessons").upsert(lesson_data).execute()
    return res.data[0] if res.data else lesson_data

def insert_lesson_steps(steps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not steps:
        return []
    supabase = get_supabase()
    res = supabase.table("lesson_steps").insert(steps).execute()
    return res.data or []

# Concept Mastery operations
def get_user_concept_mastery(user_id: str) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("concept_mastery").select("*").eq("user_id", user_id).order("mastery_score", desc=True).execute()
    return res.data or []

def upsert_concept_mastery(mastery_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    if not mastery_records:
        return []
    supabase = get_supabase()
    res = supabase.table("concept_mastery").upsert(mastery_records).execute()
    return res.data or []

# Learning Path operations
def get_user_learning_path(user_id: str) -> Optional[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("learning_paths").select("*, learning_path_items(*)").eq("user_id", user_id).order("updated_at", desc=True).limit(1).execute()
    return res.data[0] if res.data else None

def create_or_update_learning_path(path_data: Dict[str, Any], items: List[Dict[str, Any]]) -> Dict[str, Any]:
    supabase = get_supabase()
    path_res = supabase.table("learning_paths").upsert(path_data).execute()
    path_obj = path_res.data[0] if path_res.data else path_data
    path_id = path_obj.get("id")
    
    if items and path_id:
        for item in items:
            item["learning_path_id"] = path_id
            item["user_id"] = path_data["user_id"]
        supabase.table("learning_path_items").upsert(items).execute()
    
    return path_obj

# Learning History operations
def get_user_learning_history(user_id: str) -> List[Dict[str, Any]]:
    supabase = get_supabase()
    res = supabase.table("learning_history").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(20).execute()
    return res.data or []

def record_learning_history(history_data: Dict[str, Any]) -> Dict[str, Any]:
    supabase = get_supabase()
    res = supabase.table("learning_history").insert(history_data).execute()
    return res.data[0] if res.data else history_data
