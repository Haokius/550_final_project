from fastapi import HTTPException, APIRouter

example_router = APIRouter(
    prefix="/example",
    tags=["example"],
)

@example_router.get("/")
async def read_root():
    return {"message": "Hello World"}

@example_router.get("/{item_id}")
def read_item(item_id: int, q: str = None):
    if item_id == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item_id": item_id, "q": q}