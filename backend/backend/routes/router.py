from fastapi import APIRouter
from .user_router import user_router
from .general_router import general_router

router = APIRouter()

router.include_router(user_router)
router.include_router(general_router)