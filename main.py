from fastapi.middleware.cors import CORSMiddleware
from config import app
from app.routes import router as chatbot_router
from app.helper.chatbot_helper import initialize_database

# CORS configuration
origins = [
    "*",  # Adjust this to the origins you need, '*' for open access
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Or restrict to ['GET', 'POST', etc.]
    allow_headers=["*"],
)


app.include_router(chatbot_router)




if __name__ == "__main__":
    initialize_database()
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002, log_level="info")