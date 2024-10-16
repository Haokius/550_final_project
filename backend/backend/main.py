from fastapi import FastAPI
from typing import Union

app = FastAPI()   

@app.get("/") 
def main_route() -> dict:     
    return {"message": "Hello World!"}

@app.get("/dummy")
def dummy(q: Union[int, None] = None) -> dict:
    if q is None:
        return {"message": "No query parameter provided"}
    return {"q": q}