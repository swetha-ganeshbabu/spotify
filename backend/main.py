from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import search, analyze, feedback, evaluate, similar

app = FastAPI(title="Song Story API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(feedback.router, prefix="/api")
app.include_router(evaluate.router, prefix="/api")
app.include_router(similar.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
