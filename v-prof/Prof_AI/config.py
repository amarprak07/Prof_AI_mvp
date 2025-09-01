# config.py
import os
from dotenv import load_dotenv

load_dotenv()

# --- API Keys ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# --- Project Paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DOCUMENTS_DIR = os.path.join(DATA_DIR, "documents")
VECTORSTORE_DIR = os.path.join(DATA_DIR, "vectorstore")
COURSES_DIR = os.path.join(DATA_DIR, "courses")

# --- Database Settings ---

CHROMA_DB_PATH = VECTORSTORE_DIR
CHROMA_COLLECTION_NAME = "profai_documents"

# --- LLM & RAG Settings ---
LLM_MODEL_NAME = "gpt-4o-mini"
EMBEDDING_MODEL_NAME = "text-embedding-3-large"
CURRICULUM_GENERATION_MODEL = "gpt-4o-mini"
CONTENT_GENERATION_MODEL = "gpt-4o-mini"

# --- Text Processing ---
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
MAX_CHUNK_SIZE = 800
RETRIEVAL_K = 4
RETRIEVAL_SEARCH_TYPE = "mmr"

# --- File Paths ---
OUTPUT_JSON_PATH = os.path.join(COURSES_DIR, "course_output.json")

# --- Audio Settings ---
SARVAM_TTS_SPEAKER = "anushka"

# --- Server Configuration ---
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 5001))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

# --- Supported Languages ---
SUPPORTED_LANGUAGES = [
    {"code": "en-IN", "name": "English"},
    {"code": "hi-IN", "name": "Hindi"},
    {"code": "bn-IN", "name": "Bengali"},
    {"code": "mr-IN", "name": "Marathi"},
    {"code": "ta-IN", "name": "Tamil"},
    {"code": "te-IN", "name": "Telugu"},
    {"code": "kn-IN", "name": "Kannada"},
    {"code": "ml-IN", "name": "Malayalam"},
    {"code": "gu-IN", "name": "Gujarati"},
    {"code": "pa-IN", "name": "Punjabi"},
    {"code": "ur-IN", "name": "Urdu"}
]

# --- Prompt Template ---
QA_PROMPT_TEMPLATE = """You are ProfessorAI, a highly intelligent AI assistant. Answer questions based *strictly* on the provided context.
If the answer is not in the context, say "I cannot find the answer to your question in the provided documents."
Respond in {response_language}.

Context:
{context}

Question: {question}

Answer:"""

# Create directories if they don't exist
os.makedirs(DOCUMENTS_DIR, exist_ok=True)
os.makedirs(VECTORSTORE_DIR, exist_ok=True)
os.makedirs(COURSES_DIR, exist_ok=True)