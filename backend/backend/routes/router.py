from fastapi import APIRouter
from .example_router import example_router

router = APIRouter()

router.include_router(example_router)