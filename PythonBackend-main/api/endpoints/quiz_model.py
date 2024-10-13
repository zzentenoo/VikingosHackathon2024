from pydantic import BaseModel

class QuizRespuesta(BaseModel):
    email: str
    modulo: int
    marcador: int