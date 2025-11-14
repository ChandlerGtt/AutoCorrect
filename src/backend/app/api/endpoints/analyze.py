from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class AnalyzeInput(BaseModel):
    current_word: str
    current_block: list[str]

@router.post("/")
async def analyze_word(data: AnalyzeInput):
    print("Current word:", data.current_word)
    print("Current block:", data.current_block)
    return {"received": True}
