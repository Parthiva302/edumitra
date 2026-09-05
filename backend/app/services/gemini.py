import json
import logging
from typing import Dict, Any, List, Optional
from google import genai
from google.genai import types
from app.config import settings

logger = logging.getLogger("edumitra.gemini")

_client: Optional[genai.Client] = None

def get_genai_client() -> genai.Client:
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured.")
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client

def generate_text(prompt: str, system_instruction: Optional[str] = None, model: Optional[str] = None) -> str:
    """Generate freeform or structured text from Gemini with robust error handling"""
    client = get_genai_client()
    target_model = model or settings.GEMINI_MODEL
    
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.7,
    )
    
    try:
        response = client.models.generate_content(
            model=target_model,
            contents=prompt,
            config=config
        )
        return response.text or ""
    except Exception as e:
        logger.error(f"Gemini generate_text error: {e}")
        raise

def generate_structured_json(prompt: str, system_instruction: Optional[str] = None, model: Optional[str] = None) -> Dict[str, Any]:
    """Generate and parse structured JSON from Gemini with robust cleaning"""
    client = get_genai_client()
    target_model = model or settings.GEMINI_MODEL
    
    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        response_mime_type="application/json",
        temperature=0.3,
    )
    
    try:
        response = client.models.generate_content(
            model=target_model,
            contents=prompt,
            config=config
        )
        text = response.text or "{}"
    except Exception as e:
        logger.error(f"Gemini generate_structured_json error: {e}")
        raise

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Clean markdown wrappers if any
        clean = text.strip()
        if clean.startswith("```json"):
            clean = clean[7:]
        elif clean.startswith("```"):
            clean = clean[3:]
        if clean.endswith("```"):
            clean = clean[:-3]
        return json.loads(clean.strip())

def get_embedding(text: str) -> List[float]:
    """Generate vector embeddings using Gemini embedding models with 768 dimensions"""
    client = get_genai_client()
    models_to_try = [settings.GEMINI_EMBEDDING_MODEL, "gemini-embedding-001", "text-embedding-004"]
    
    for em_model in models_to_try:
        if not em_model:
            continue
        try:
            config = types.EmbedContentConfig(output_dimensionality=768)
            result = client.models.embed_content(
                model=em_model,
                contents=text,
                config=config
            )
            if hasattr(result, "embeddings") and result.embeddings:
                vals = result.embeddings[0].values
                return vals[:768]
            elif hasattr(result, "embedding") and result.embedding:
                vals = result.embedding.values
                return vals[:768]
        except Exception as e:
            try:
                # Retry without explicit config in case model doesn't support dimensionality param
                result = client.models.embed_content(
                    model=em_model,
                    contents=text,
                )
                if hasattr(result, "embeddings") and result.embeddings:
                    vals = result.embeddings[0].values
                    return vals[:768]
                elif hasattr(result, "embedding") and result.embedding:
                    vals = result.embedding.values
                    return vals[:768]
            except Exception as e2:
                logger.debug(f"Model {em_model} embed attempt failed: {e2}")
                continue
    return []

def get_batch_embeddings(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for multiple chunks efficiently matching 768 dimensions"""
    client = get_genai_client()
    em_model = settings.GEMINI_EMBEDDING_MODEL or "gemini-embedding-001"
    
    embeddings = []
    for text in texts:
        if not text.strip():
            embeddings.append([])
            continue
        try:
            config = types.EmbedContentConfig(output_dimensionality=768)
            res = client.models.embed_content(
                model=em_model,
                contents=text[:2048],
                config=config
            )
            if hasattr(res, "embeddings") and res.embeddings:
                embeddings.append(res.embeddings[0].values[:768])
            elif hasattr(res, "embedding") and res.embedding:
                embeddings.append(res.embedding.values[:768])
            else:
                embeddings.append([])
        except Exception:
            try:
                res = client.models.embed_content(
                    model="gemini-embedding-001",
                    contents=text[:2048]
                )
                if hasattr(res, "embeddings") and res.embeddings:
                    embeddings.append(res.embeddings[0].values[:768])
                elif hasattr(res, "embedding") and res.embedding:
                    embeddings.append(res.embedding.values[:768])
                else:
                    embeddings.append([])
            except Exception as e2:
                logger.warning(f"Embedding error for text chunk: {e2}")
                embeddings.append([])
    return embeddings
