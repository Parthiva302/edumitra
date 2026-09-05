import os
import json
import base64
import uuid
import logging
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status
from app.database.supabase import get_auth_client

logger = logging.getLogger("edumitra.auth")

def extract_user_id_from_token(token: str) -> Optional[str]:
    """
    Safely extract and validate a UUID user ID from a token or direct UUID string.
    Supports:
    1. Direct UUID strings (with or without hyphens)
    2. Supabase JWT tokens (decoding 'sub' / 'user_id' claim)
    3. Supabase Auth API verification
    """
    if not token:
        return None

    cleaned = token.strip()

    # 1. First check if the token itself is a direct UUID
    try:
        parsed_uuid = uuid.UUID(cleaned)
        return str(parsed_uuid)
    except (ValueError, AttributeError):
        pass

    # 2. If it's a JWT (header.payload.signature), decode payload to extract sub
    parts = cleaned.split(".")
    if len(parts) == 3:
        try:
            payload_b64 = parts[1]
            rem = len(payload_b64) % 4
            if rem > 0:
                payload_b64 += "=" * (4 - rem)
            payload_json = base64.urlsafe_b64decode(payload_b64).decode("utf-8")
            payload = json.loads(payload_json)

            sub = payload.get("sub") or payload.get("user_id")
            if not sub and isinstance(payload.get("user_metadata"), dict):
                sub = payload["user_metadata"].get("sub")

            if sub:
                parsed_uuid = uuid.UUID(str(sub))
                return str(parsed_uuid)
        except Exception as e:
            logger.debug(f"Could not parse sub from JWT payload: {e}")

    # 3. Fallback: Try Supabase Auth client verification
    try:
        supabase = get_auth_client()
        user_res = supabase.auth.get_user(cleaned)
        if user_res and user_res.user and user_res.user.id:
            parsed_uuid = uuid.UUID(str(user_res.user.id))
            return str(parsed_uuid)
    except Exception as e:
        logger.debug(f"Supabase auth.get_user verification failed: {e}")

    return None

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extract and guarantee valid UUID user ID from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing."
        )
    
    token = authorization.replace("Bearer ", "").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format."
        )
        
    user_id = extract_user_id_from_token(token)
    if user_id:
        return user_id

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired session token."
    )

def get_optional_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Optional user ID extractor returning valid UUID or None"""
    if not authorization:
        return None
    try:
        return get_current_user_id(authorization)
    except Exception:
        return None

