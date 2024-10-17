from fastapi import APIRouter
from .example_router import example_router

router = APIRouter(responses = {404: {"description": "Not found"}})

router.include_router(example_router)