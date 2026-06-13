from fastapi import FastAPI

from app.api.ingredients import router as ingredients_router
from app.api.recipes import router as recipes_router

app = FastAPI(title="Recipe Backend")
app.include_router(recipes_router)
app.include_router(ingredients_router)


@app.get("/")
def root():
    return {"message": "API is running"}