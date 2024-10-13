from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, validator
from typing import List
from firebase_admin import firestore  # Assuming you're using firebase-admin
import vertexai
from vertexai.generative_models import GenerativeModel
import json
import re
import logging

# Initialize Firestore
db = firestore.client()

# Set logging to DEBUG for detailed logs (change to INFO in production)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

vertexai.init(location='us-central1')  

class ContextEvaluationRequest(BaseModel):
    email: str
    text: str

    @validator('email')
    def validate_email(cls, v):
        v = v.strip().lower()  # Trim and convert to lowercase
        email_regex = re.compile(
            r"(^[\w\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
        )
        if not email_regex.match(v):
            raise ValueError('Formato de correo electrónico inválido')
        return v

class Module(BaseModel):
    moduleNumber: int
    moduleTitle: str
    moduleDescription: str
    moduleInformation: str

class ContextEvaluationResponse(BaseModel):
    pathType: str
    path: List[Module]

def extract_json_from_markdown(text: str) -> str:
    pattern = r'```json\s*(\{.*?\})\s*```'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1)
    else:
        raise ValueError("No JSON found in the generated text.")

@router.post("/evaluate-context/", response_model=ContextEvaluationResponse)
async def evaluate_context(request: ContextEvaluationRequest):
    logger.debug(f"Received request: {request.json()}")

    users_ref = db.collection('users')
    
    try:
        # Perform a query where 'email' field equals the requested email
        query = users_ref.where('email', '==', request.email).stream()
        results = list(query)
        logger.debug(f"Firestore query executed for email: {request.email}, found {len(results)} result(s)")
    except Exception as e:
        logger.error(f"Error al consultar Firestore: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error al consultar Firestore: {str(e)}")

    if len(results) == 0:
        logger.warning(f"Usuario no encontrado: {request.email}")
        # For debugging: List all existing emails
        try:
            all_users = users_ref.stream()
            all_emails = [user.to_dict().get('email') for user in all_users if 'email' in user.to_dict()]
            logger.debug(f"Existing emails in Firestore: {all_emails}")
        except Exception as e:
            logger.error(f"Error al listar usuarios en Firestore: {e}", exc_info=True)
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if len(results) > 1:
        logger.warning(f"Multiple users found with email: {request.email}")
        raise HTTPException(status_code=400, detail="Múltiples usuarios encontrados con el mismo correo electrónico")

    user_doc = results[0]
    user_id = user_doc.id
    logger.debug(f"Usuario encontrado: {user_id}")

    try:
        model = GenerativeModel("gemini-1.0-pro")  # Replace with your model name
        logger.debug("GenerativeModel instantiated successfully")
    except Exception as e:
        logger.error(f"Error al instanciar GenerativeModel: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error al instanciar GenerativeModel: {str(e)}")

    prompt = f"""
    {request.text}

    Genera un JSON con la siguiente estructura:

    ```json
    {{
        "pathType": "Tipo de path",
        "path": [
            {{
                "moduleNumber": 1,
                "moduleTitle": "Titulo de modulo 1",
                "moduleDescription": "Descripción breve, no más de 100 caracteres...",
                "moduleInformation": "Información detallada para este módulo..."
            }},
            ...
        ]
    }}
    ```
    El pathType solo puede ser uno de los cuatro valores: Seguridad financiera, Resilencia financiera, Control financiero, Libertad financiera.
    Todas las respuestas deben estar en español, enfocadas para una audiencia latinoamericana.
    Genera al menos 5 módulos.
    """

    try:
        # Generate content using the GenerativeModel
        logger.debug("Sending prediction request to GenerativeModel")
        model_response = model.generate_content(prompt)
        logger.debug("Prediction received from GenerativeModel")
        
        # Log the entire response object for inspection
        logger.debug(f"Full GenerationResponse: {model_response}")

        # Extract the generated text using the provided method
        try:
            generated_text = model_response.candidates[0].content.parts[0].text
            logger.debug(f"Generated Text: {generated_text}")
        except (AttributeError, IndexError) as e:
            logger.error(f"Error al extraer el texto generado: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail="Error al extraer el texto generado del modelo de IA")
        
        # Extract JSON from the generated markdown text
        try:
            json_text = extract_json_from_markdown(generated_text)
            logger.debug(f"Extracted JSON Text: {json_text}")
        except ValueError as e:
            logger.error(f"Error al extraer JSON del texto generado: {e}", exc_info=True)
            logger.debug(f"Generated Text for JSON Extraction: {generated_text}")  # Log the text that failed extraction
            raise HTTPException(status_code=500, detail="Error al extraer JSON del texto generado por el modelo de IA")
        
    except Exception as e:
        logger.error(f"Error al generar contenido con el modelo de IA: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error al generar contenido con el modelo de IA: {str(e)}")

    try:
        data = json.loads(json_text)
        logger.debug("Generated JSON parsed successfully")
    except json.JSONDecodeError as e:
        logger.error(f"JSON generado inválido: {e}", exc_info=True)
        logger.debug(f"Extracted JSON Text: {json_text}")  # Log the JSON text that failed to parse
        raise HTTPException(status_code=500, detail=f"JSON generado inválido: {str(e)}")

    valid_path_types = ["Seguridad financiera", "Resilencia financiera", "Control financiero", "Libertad financiera"]
    path_type = data.get("pathType")
    if path_type not in valid_path_types:
        logger.warning(f"pathType inválido: {path_type}")
        raise HTTPException(status_code=400, detail=f"pathType inválido: '{path_type}'. Debe ser uno de {valid_path_types}")

    path = data.get("path")
    if not isinstance(path, list):
        logger.warning("El campo 'path' no es una lista")
        raise HTTPException(status_code=400, detail="El campo 'path' debe ser una lista de módulos")
    if len(path) < 5:
        logger.warning(f"Se requieren al menos 5 módulos, pero se recibieron {len(path)}")
        raise HTTPException(status_code=400, detail="Se requieren al menos 5 módulos en 'path'")

    required_module_keys = {"moduleNumber", "moduleTitle", "moduleDescription", "moduleInformation"}
    for idx, module in enumerate(path, start=1):
        if not isinstance(module, dict):
            logger.warning(f"El módulo en la posición {idx} no es un objeto válido")
            raise HTTPException(status_code=400, detail=f"El módulo en la posición {idx} no es un objeto válido")
        missing_keys = required_module_keys - module.keys()
        if missing_keys:
            logger.warning(f"El módulo en la posición {idx} carece de las claves: {missing_keys}")
            raise HTTPException(
                status_code=400, 
                detail=f"El módulo en la posición {idx} carece de las claves: {', '.join(missing_keys)}"
            )

    try:
        users_ref.document(user_id).update({
            'contextEvaluation': data
        })
        logger.debug(f"Evaluación de contexto actualizada para el usuario: {user_id}")
    except Exception as e:
        logger.error(f"Error al actualizar Firestore: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error al actualizar Firestore: {str(e)}")

    return data
