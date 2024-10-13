# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.endpoints.quiz import router as quiz_router
from api.endpoints.user_endpoint import router as user_router
from api.endpoints.context_evaluation import router as context_evaluation_router
from api.endpoints.chatbot import router as chatbot_router
app = FastAPI()

origins = [
    "http://localhost:5173",  # React development server
    # Add your frontend's production URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quiz_router, prefix="/api/quiz")
app.include_router(user_router, prefix="/api/user")
app.include_router(context_evaluation_router, prefix="/api/user")
app.include_router(chatbot_router, prefix="/api/user")
@app.get("/")
def read_root():
    return {"Hello": "World"}
