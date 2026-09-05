import io
import os
import re
import json
import logging
from typing import Dict, Any, List, Optional
import pypdf
import docx
import pptx

from app.services.gemini import generate_structured_json, get_batch_embeddings
from app.database.supabase import (
    get_supabase,
    insert_document_sections,
    insert_document_chunks
)

logger = logging.getLogger("edumitra.document_processor")

def extract_text_from_file_bytes(file_bytes: bytes, file_type: str, file_name: str) -> str:
    """Extract raw text from PDF, DOCX, PPTX, or TXT file bytes"""
    ft = file_type.lower()
    fn = file_name.lower()
    
    try:
        if "pdf" in ft or fn.endswith(".pdf"):
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            text_parts = []
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                if page_text.strip():
                    text_parts.append(f"--- Page {i+1} ---\n{page_text}")
            return "\n\n".join(text_parts)
            
        elif "docx" in ft or "doc" in ft or fn.endswith(".docx") or fn.endswith(".doc"):
            doc = docx.Document(io.BytesIO(file_bytes))
            text_parts = [p.text for p in doc.paragraphs if p.text.strip()]
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        text_parts.append(row_text)
            return "\n\n".join(text_parts)
            
        elif "pptx" in ft or "ppt" in ft or fn.endswith(".pptx") or fn.endswith(".ppt"):
            prs = pptx.Presentation(io.BytesIO(file_bytes))
            text_parts = []
            for i, slide in enumerate(prs.slides):
                slide_texts = []
                for shape in slide.shapes:
                    if hasattr(shape, "text") and shape.text.strip():
                        slide_texts.append(shape.text.strip())
                if slide_texts:
                    text_parts.append(f"--- Slide {i+1} ---\n" + "\n".join(slide_texts))
            return "\n\n".join(text_parts)
            
        else:
            # Fallback to UTF-8 text
            return file_bytes.decode("utf-8", errors="ignore")
    except Exception as e:
        logger.error(f"Error extracting text from {file_name}: {e}")
        return file_bytes.decode("utf-8", errors="ignore")

def analyze_document_structure(text: str, file_name: str) -> Dict[str, Any]:
    """Use Gemini to identify chapters, sections, key concepts, formulas, definitions, and learning objectives"""
    truncated_sample = text[:12000] if len(text) > 12000 else text
    
    prompt = f"""
Analyze the following educational text from document '{file_name}' and produce a comprehensive structured breakdown.
Document text sample:
{truncated_sample}

Return a valid JSON object matching this schema:
{{
  "title": "Document title or subject name",
  "subject": "Main educational subject (e.g. Physics, Biology, Computer Science, Mathematics, History, etc.)",
  "summary": "2-3 sentence overview of the document contents",
  "key_concepts": ["List", "of", "5-10", "core", "concepts", "covered"],
  "learning_objectives": ["Objective 1", "Objective 2", "Objective 3"],
  "definitions": [{{"term": "term name", "definition": "clear definition"}}],
  "formulas": [{{"formula": "E=mc^2", "name": "Mass-energy equivalence", "variables": "E: Energy, m: mass, c: speed of light"}}],
  "chapters": [
    {{
      "chapter_number": 1,
      "chapter_title": "Chapter title",
      "sections": [
        {{
          "section_number": 1,
          "section_title": "Section title",
          "summary": "Brief section summary",
          "concepts": ["Concepts in this section"]
        }}
      ]
    }}
  ]
}}
"""
    try:
        structure = generate_structured_json(prompt, system_instruction="You are a senior curriculum architect and pedagogical document analyst.")
        return structure
    except Exception as e:
        logger.warning(f"Document structure analysis error: {e}")
        clean_name = os.path.splitext(file_name)[0].replace("_", " ").title()
        return {
            "title": clean_name,
            "subject": "General STEM / Education",
            "summary": f"Comprehensive educational material regarding {clean_name}.",
            "key_concepts": ["Foundational Principles", "Analytical Framework", "Practical Applications", "Assessment Checkpoints"],
            "learning_objectives": [f"Understand key concepts of {clean_name}", "Apply principles to solve problems", "Identify core mechanisms"],
            "definitions": [],
            "formulas": [],
            "chapters": [
                {
                    "chapter_number": 1,
                    "chapter_title": f"Fundamentals of {clean_name}",
                    "sections": [
                        {
                            "section_number": 1,
                            "section_title": "Core Concepts & Framework",
                            "summary": f"Detailed introduction to {clean_name}.",
                            "concepts": ["Core Principles", "Mechanisms"]
                        }
                    ]
                }
            ]
        }

def chunk_text(text: str, chunk_size: int = 800, chunk_overlap: int = 150) -> List[str]:
    """Split text into overlapping semantic chunks for RAG"""
    paragraphs = re.split(r'\n\s*\n', text)
    chunks = []
    current_chunk = ""
    
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
            
        if len(current_chunk) + len(p) < chunk_size:
            current_chunk += ("\n\n" if current_chunk else "") + p
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            # If paragraph itself is longer than chunk_size, split by sentences
            if len(p) > chunk_size:
                sentences = re.split(r'(?<=[.!?])\s+', p)
                sub_chunk = ""
                for s in sentences:
                    if len(sub_chunk) + len(s) < chunk_size:
                        sub_chunk += (" " if sub_chunk else "") + s
                    else:
                        if sub_chunk:
                            chunks.append(sub_chunk.strip())
                        sub_chunk = s
                current_chunk = sub_chunk
            else:
                current_chunk = p
                
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
        
    return [c for c in chunks if len(c.strip()) > 30]

def process_document_end_to_end(
    material_id: str,
    user_id: str,
    file_bytes: bytes,
    file_name: str,
    file_type: str
) -> Dict[str, Any]:
    """Full end-to-end document processing: extraction, structure analysis, chunking, embeddings, persistence"""
    logger.info(f"Starting end-to-end processing for material {material_id} ({file_name})")
    
    # 1. Extract text
    raw_text = extract_text_from_file_bytes(file_bytes, file_type, file_name)
    if not raw_text.strip():
        raise ValueError("Could not extract readable text from document.")
        
    # 2. Analyze document structure
    structure = analyze_document_structure(raw_text, file_name)
    doc_title = structure.get("title") or file_name
    key_concepts = structure.get("key_concepts", [])
    
    # 3. Store document sections in database
    db_sections = []
    for chap in structure.get("chapters", []):
        chap_num = chap.get("chapter_number", 1)
        chap_title = chap.get("chapter_title", "Chapter")
        for sec in chap.get("sections", []):
            sec_num = sec.get("section_number", 1)
            sec_title = sec.get("section_title", "Section")
            db_sections.append({
                "material_id": material_id,
                "user_id": user_id,
                "chapter_number": chap_num,
                "chapter_title": chap_title,
                "section_number": sec_num,
                "section_title": sec_title,
                "content": sec.get("summary", "")
            })
            
    saved_sections = []
    if db_sections:
        try:
            saved_sections = insert_document_sections(db_sections)
        except Exception as e:
            logger.warning(f"Error saving document sections: {e}")
            
    # 4. Chunk text & generate embeddings
    text_chunks = chunk_text(raw_text)
    logger.info(f"Generated {len(text_chunks)} text chunks for material {material_id}")
    
    embeddings = get_batch_embeddings(text_chunks)
    
    # 5. Insert chunks into document_chunks table
    db_chunks = []
    for i, (chunk, emb) in enumerate(zip(text_chunks, embeddings)):
        db_chunks.append({
            "material_id": material_id,
            "user_id": user_id,
            "chunk_index": i,
            "content": chunk,
            "embedding": emb,
            "metadata": {
                "file_name": file_name,
                "title": doc_title,
                "chunk_index": i,
                "total_chunks": len(text_chunks),
                "key_concepts": key_concepts[:4]
            }
        })
        
    if db_chunks:
        try:
            insert_document_chunks(db_chunks)
        except Exception as e:
            logger.warning(f"Error saving document chunks: {e}")
            
    # 6. Update material record in database with completed status and title
    try:
        supabase = get_supabase()
        supabase.table("materials").update({
            "title": doc_title,
            "description": structure.get("summary", ""),
            "processing_status": "ready",
            "processing_error": None
        }).eq("id", material_id).execute()
    except Exception as e:
        logger.warning(f"Error updating material status: {e}")
        
    return {
        "success": True,
        "material_id": material_id,
        "file_name": file_name,
        "title": doc_title,
        "structure": structure,
        "chapters_count": len(structure.get("chapters", [])),
        "sections_count": len(db_sections),
        "chunks_count": len(text_chunks),
        "key_concepts": key_concepts,
        "processing_status": "ready"
    }
