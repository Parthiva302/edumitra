import asyncio
import json
import os
import sys
import httpx
from dotenv import load_dotenv
from supabase import create_client as create_supa_client

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.main import app

async def main():
    print("==================================================")
    print("   EDUMITRA FULL PLATFORM END-TO-END VERIFICATION")
    print("==================================================")
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver", timeout=120.0) as client:
        # 1. Health Check
        print("\n1. Testing Health Endpoint...")
        res = await client.get("/health")
        print(f"Health Response: {res.status_code} - {res.json()}")
        assert res.status_code == 200, "Health check failed"

        # 1b. Auth Setup (Login / Register via Admin SDK for deterministic test session)
        print("\n1b. Authenticating real test student...")
        test_email = "student_real_e2e@edumitra.ai"
        test_password = "Password123!"
        
        # Ensure user exists via admin client
        load_dotenv(r"c:\Users\parth\Downloads\edumitra\.env")
        supa_admin = create_supa_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))
        
        try:
            admin_user = supa_admin.auth.admin.create_user({
                "email": test_email,
                "password": test_password,
                "email_confirm": True,
                "user_metadata": {"full_name": "E2E Test Student"}
            })
            print(f"Created real Supabase user: {admin_user.user.id}")
            supa_admin.table("profiles").upsert({
                "id": admin_user.user.id,
                "full_name": "E2E Test Student",
                "email": test_email,
                "preferred_language": "English",
                "education_level": "Beginner"
            }).execute()
        except Exception:
            pass
            
        login_res = await client.post("/api/auth/login", json={"email": test_email, "password": test_password})
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        auth_data = login_res.json()
        access_token = auth_data.get("token")
        user_id = auth_data.get("user", {}).get("id")
        print(f"Authenticated successfully! Token received: {access_token[:20]}... User ID: {user_id}")
        client.headers.update({"Authorization": f"Bearer {access_token}"})

        # 2. Topic Lesson Generation (Postman API Testing)
        print("\n2. Testing Topic Lesson Creation (Postman API Testing)...")
        topic_payload = {
            "topic": "Postman API Testing and HTTP Methods",
            "level": "beginner",
            "duration": "20m",
            "style": "simple_visual",
            "language": "english",
            "goal": "understand_concept"
        }
        res = await client.post("/api/lessons/create", json=topic_payload)
        assert res.status_code == 200, f"Lesson creation failed: {res.text}"
        lesson_data = res.json()
        lesson_id = lesson_data.get("id")
        steps = lesson_data.get("steps", [])
        print(f"Lesson Created Successfully! ID: {lesson_id}")
        print(f"Total Steps Generated: {len(steps)}")
        for idx, step in enumerate(steps):
            print(f"  Step {idx+1}: {step.get('title')} (Visual: {step.get('visualType')})")
        
        visual_types = [s.get("visualType") for s in steps]
        print(f"Generated Visual Types: {visual_types}")

        # 3. Video Scene Planning for Lesson Step 1
        print("\n3. Testing Video Scene Generation for Step 1...")
        video_payload = {
            "lesson_id": lesson_id,
            "title": "Postman API Testing and HTTP Methods",
            "subject": "Postman API Testing",
            "steps": steps,
            "language": "English"
        }
        res = await client.post("/api/video/generate", json=video_payload)
        assert res.status_code == 200, f"Video generation failed: {res.text}"
        video_data = res.json()
        print(f"Video Generation Result: {video_data.get('status')} - Total Duration: {video_data.get('total_duration_seconds')}s - Scenes: {len(video_data.get('scenes', []))}")
        for s in video_data.get("scenes", []):
            print(f"   Scene {s.get('scene_number')}: {s.get('scene_type')} | Visual: {s.get('visual_type')} | Duration: {s.get('duration_seconds')}s | Purpose: {s.get('educational_purpose')}")

        # 4. Interactive Answer Evaluation & Misconception Remediation
        print("\n4. Testing Interactive Question Evaluation (Misconception Detection)...")
        eval_payload = {
            "lesson_id": lesson_id,
            "concept": "Ohm's Law & Circuit Resistance",
            "question": "What happens to the current in a circuit if resistance is increased while voltage is held constant?",
            "expected_answer": "According to Ohm's Law (I = V/R), if resistance increases with constant voltage, the current decreases.",
            "student_answer": "The current increases because more resistance pushes more electrons through faster.",
            "question_type": "short_answer",
            "language": "english"
        }
        res = await client.post("/api/questions/evaluate", json=eval_payload)
        assert res.status_code == 200, f"Answer evaluation failed: {res.text}"
        eval_data = res.json()
        print(f"Evaluation is_correct: {eval_data.get('is_correct')}")
        print(f"Misconception Detected: {eval_data.get('misconception_detected')}")
        print(f"Diagnostic Misconception: {eval_data.get('misconception')}")
        print(f"Adaptive Remediation Dialogue: {eval_data.get('remediation_dialogue')}")
        print(f"Remediation Visual Type: {eval_data.get('remediation_visual_type')}")
        print(f"Updated Mastery Level: {eval_data.get('mastery_updated_level')}")

        # 5. Live Question Answering (Interruption in Classroom)
        print("\n5. Testing Live Teacher Q&A Interruption...")
        qa_payload = {
            "lesson_id": lesson_id,
            "concept": "HTTP Methods",
            "question": "Can you explain GET vs POST simply?",
            "language": "english",
            "teaching_style": "simple_visual"
        }
        res = await client.post("/api/questions/ask-teacher", json=qa_payload)
        assert res.status_code == 200, f"Teacher Q&A failed: {res.text}"
        qa_data = res.json()
        print(f"Teacher Answer: {qa_data.get('answer_text')[:200]}...")
        print(f"Suggested Visual Action: {qa_data.get('suggested_visual_action')}")

        # 6. Post-Lesson Study Center Generation (Notes, Flashcards, Concept Map, Assessment)
        print("\n6. Testing Post-Lesson Content Generation...")
        lesson_context_payload = {
            "topic": "Postman API Testing",
            "concepts": ["HTTP Methods", "GET vs POST", "Status Codes (200, 404, 500)", "Headers and Auth"],
            "level": "beginner",
            "count": 4,
            "lesson_id": lesson_id
        }
        
        # Notes
        notes_res = await client.post("/api/notes/generate", json=lesson_context_payload)
        assert notes_res.status_code == 200, f"Notes generation failed: {notes_res.text}"
        notes_data = notes_res.json()
        print(f"Generated Notes: Title '{notes_data.get('title')}' with {len(notes_data.get('key_takeaways', []))} takeaways.")

        # Flashcards
        fc_res = await client.post("/api/flashcards/generate", json=lesson_context_payload)
        assert fc_res.status_code == 200, f"Flashcards generation failed: {fc_res.text}"
        fc_data = fc_res.json()
        print(f"Generated Flashcards: {len(fc_data.get('cards', []))} flashcards.")

        # Concept Map
        cm_res = await client.post("/api/concept-map/generate", json=lesson_context_payload)
        assert cm_res.status_code == 200, f"Concept map generation failed: {cm_res.text}"
        cm_data = cm_res.json()
        print(f"Generated Concept Map: Root '{cm_data.get('root', {}).get('name')}' with {len(cm_data.get('root', {}).get('children', []))} branches.")

        # Assessment Quiz
        quiz_res = await client.post("/api/assessment/generate", json=lesson_context_payload)
        assert quiz_res.status_code == 200, f"Assessment generation failed: {quiz_res.text}"
        quiz_data = quiz_res.json()
        print(f"Generated Assessment: {len(quiz_data.get('questions', []))} questions.")

        # 7. Material Upload & RAG Indexing Test
        print("\n7. Testing Material Upload and RAG Processing...")
        test_file_content = """# Postman API Testing & REST Architecture
## Introduction to APIs
An Application Programming Interface (API) allows two software systems to communicate.
REST (Representational State Transfer) is an architectural style for distributed hypermedia systems.

## HTTP Methods
- GET: Retrieve a resource from the server. Safe and idempotent.
- POST: Create a new resource on the server. Non-idempotent.
- PUT: Replace an existing resource completely.
- DELETE: Remove a resource from the server.

## Authentication Mechanisms
Postman supports multiple auth types:
1. Bearer Token: A JWT or opaque token sent in the Authorization header: `Authorization: Bearer <token>`
2. API Key: Sent either as a query parameter or custom header (e.g. `X-API-Key`).
3. Basic Auth: Base64-encoded username:password string.

## Status Codes
- 200 OK: Successful request.
- 201 Created: Resource successfully created.
- 400 Bad Request: Malformed syntax or invalid parameters.
- 401 Unauthorized: Authentication credentials missing or invalid.
- 404 Not Found: Requested endpoint does not exist.
- 500 Internal Server Error: Server encountered an unexpected condition.
"""
        files = {"file": ("Postman_Testing_Notes.txt", test_file_content.encode("utf-8"), "text/plain")}
        upload_res = await client.post("/api/materials/upload", files=files)
        assert upload_res.status_code == 200, f"Material upload failed: {upload_res.text}"
        mat_data = upload_res.json()
        material_id = mat_data.get("id")
        print(f"Material Uploaded Successfully! Material ID: {material_id}")
        print(f"Extracted Title: {mat_data.get('title')}")
        print(f"Chunks Count: {mat_data.get('total_chunks')}")

        # 8. RAG Query Test
        print("\n8. Testing Grounded RAG Query...")
        rag_payload = {
            "query": "What does my uploaded material say about Bearer Token authentication and status codes?"
        }
        rag_res = await client.post(f"/api/materials/{material_id}/query", json=rag_payload)
        assert rag_res.status_code == 200, f"RAG query failed: {rag_res.text}"
        rag_data = rag_res.json()
        print(f"RAG Grounded Response:\n{rag_data.get('answer')[:300]}...\n")
        source_refs = rag_data.get("source_references", [])
        print(f"Source References ({len(source_refs)}): {source_refs}")

        print("\n==================================================")
        print("   ALL 8 END-TO-END SYSTEM TESTS PASSED PERFECTLY!")
        print("==================================================")

if __name__ == "__main__":
    asyncio.run(main())
