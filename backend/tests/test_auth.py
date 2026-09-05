import pytest
from app.api.auth_deps import extract_user_id_from_token, get_current_user_id
from fastapi import HTTPException

def test_extract_user_id_from_raw_uuid():
    raw_uuid = "4e3c7be4-6322-49bd-9ac8-89067a7e6503"
    extracted = extract_user_id_from_token(raw_uuid)
    assert extracted == "4e3c7be4-6322-49bd-9ac8-89067a7e6503"

def test_extract_user_id_from_jwt():
    # Standard Supabase JWT with sub claim
    jwt_token = (
        "eyJhbGciOiJFUzI1NiIsImtpZCI6IjE1Mjk0MDZkLThkZWMtNDQzYS1iOTE1LTg2ZjNmYzNlMDFlYSIsInR5cCI6IkpXVCJ9."
        "eyJpc3MiOiJodHRwczovL21ocHJndHNxZXF2cmJvZ3JwbmJwLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0ZTNjN2JlNC02MzIyLTQ5YmQtOWFjOC04OTA2N2E3ZTY1MDMiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzg4NTU0Mjg4LCJpYXQiOjE3ODg1NTA2ODgsImVtYWlsIjoicGFydGhpdmFhbmVlc2hAZ21haWwuY29tIn0."
        "fake_signature_part"
    )
    extracted = extract_user_id_from_token(jwt_token)
    assert extracted == "4e3c7be4-6322-49bd-9ac8-89067a7e6503"

def test_get_current_user_id_bearer_header():
    jwt_token = (
        "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9."
        "eyJzdWIiOiJkYjI5MDFkNy0yZGM1LTRlMjQtOTA0Yi0yMTI1M2I4YmI3MGYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIn0."
        "sig"
    )
    user_id = get_current_user_id(f"Bearer {jwt_token}")
    assert user_id == "db2901d7-2dc5-4e24-904b-21253b8bb70f"

def test_extract_user_id_invalid_token():
    invalid_token = "invalid_string_not_a_uuid_or_jwt"
    extracted = extract_user_id_from_token(invalid_token)
    assert extracted is None

    with pytest.raises(HTTPException) as exc_info:
        get_current_user_id(f"Bearer {invalid_token}")
    assert exc_info.value.status_code == 401
