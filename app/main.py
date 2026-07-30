from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.ingredients import router as ingredients_router
from app.api.matching import router as matching_router
from app.api.recipes import router as recipes_router

app = FastAPI(title="Recipe Backend")

# CORS — allows frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your teammate's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(recipes_router)
app.include_router(ingredients_router)
app.include_router(matching_router)

@app.get("/")
def root():
    return {"message": "API is running"}