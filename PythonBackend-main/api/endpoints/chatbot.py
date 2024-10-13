from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re
import logging
import vertexai
from vertexai.language_models import ChatModel

router = APIRouter()
vertexai.init(location='us-central1')  # Adjust location as needed

logger = logging.getLogger(__name__)

class ChatbotRequest(BaseModel):
    message: str

class ChatbotResponse(BaseModel):
    reply: str

@router.post("/chatbot/", response_model=ChatbotResponse)
async def chatbot_endpoint(request: ChatbotRequest):
    logger.debug(f"Received message: {request.message}")

    try:

        chat_model = ChatModel.from_pretrained("chat-bison@001") 
        chat = chat_model.start_chat(
            context="Eres un asesor financiero que ayuda a las personas con sus finanzas personales enfocándose en seguridad financiera, resiliencia financiera, control financiero y libertad financiera. Todas las respuestas deben estar en español, dirigidas a una audiencia latinoamericana.",
        )

        response = chat.send_message(request.message)


        reply = response.text
        logger.debug(f"AI reply: {reply}")

        return ChatbotResponse(reply=reply)

    except Exception as e:
        logger.error(f"Error in chatbot endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error al procesar la solicitud.")