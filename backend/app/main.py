import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.students import router as auth_router
from app.api.documents import router as documents_router
from app.api.lessons import router as lessons_router
from app.api.questions import router as questions_router
from app.api.assessment import router as assessment_router
from app.api.learning_path import router as learning_path_router
from app.api.progress import router as progress_router
from app.api.video import router as video_router
from app.api.rag import router as rag_router

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("edumitra.main")

app = FastAPI(
    title="EduMitra - Personal AI Teacher API",
    description="End-to-end pedagogical AI backend with Supabase persistence, Gemini AI lesson planning, RAG, and adaptive teaching.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API Routers
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(lessons_router)
app.include_router(questions_router)
app.include_router(assessment_router)
app.include_router(learning_path_router)
app.include_router(progress_router)
app.include_router(video_router)
app.include_router(rag_router)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "app": "EduMitra Personal AI Teacher",
        "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY),
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }
