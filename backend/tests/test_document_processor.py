import pytest
from app.services.document_processor import extract_text_from_file_bytes, chunk_text, analyze_document_structure

def test_extract_text_from_txt():
    sample_txt = b"Newton's First Law states that an object remains at rest or in uniform motion unless acted upon by a force."
    extracted = extract_text_from_file_bytes(sample_txt, "TXT", "sample.txt")
    assert "Newton's First Law" in extracted

def test_chunk_text():
    sample = ("Paragraph 1 with essential physics concepts and energy conservation.\n\n"
              "Paragraph 2 with thermodynamic equilibrium details and entropy expansion.\n\n"
              "Paragraph 3 with chemical kinetics and activation energy.")
    chunks = chunk_text(sample, chunk_size=80, chunk_overlap=20)
    assert len(chunks) >= 2
    assert any("energy" in c.lower() for c in chunks)

def test_analyze_document_structure():
    sample = "Title: Photosynthesis\nChapter 1: The Chloroplast\nSection 1: Light Reactions\nPhotosynthesis converts light energy into chemical energy."
    structure = analyze_document_structure(sample, "photosynthesis.txt")
    assert structure is not None
    assert "title" in structure
    assert "key_concepts" in structure
