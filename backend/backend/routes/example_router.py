from fastapi import HTTPException, APIRouter
import random

example_router = APIRouter(
    prefix="/example",
    tags=["example"],
)

@example_router.get("/")
async def read_root():
    return {"message": "Hello World"}

@example_router.get("/random")
async def get_random_number():
    num = random.randint(1, 100)
    return {"number": num}