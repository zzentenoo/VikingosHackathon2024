from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from api.endpoints.quiz_model import QuizRespuesta
from services.quiz_service import evaluar_quiz, get_next_module
#from api.endpoints.auth_service import get_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

router = APIRouter()

@router.post("/submit_quiz")
def submit_quiz(response: QuizRespuesta, token: str = Depends(oauth2_scheme)):
    # Implementa esta función para obtener el usuario desde el token
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    analisis = evaluar_quiz(response, token.email)  # Asocia el resultado con el email del usuario
    if analisis["pass"]:
        next_module = get_next_module(token.email)
        return {"message": f"Has desbloqueado el módulo {next_module}", "next_module": next_module}
    else:
        return {"message": "Revisa el contenido y vuelve a intentarlo."}
