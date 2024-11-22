from fastapi import HTTPException, APIRouter

user_router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@user_router.post("/register")
async def register_user():
    return None

