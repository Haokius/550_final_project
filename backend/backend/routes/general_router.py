from fastapi import HTTPException, APIRouter

general_router = APIRouter(
    prefix="/api",
    tags=["api"],
)

@general_router.get("/stocks")
async def get_stock_data():
    return None