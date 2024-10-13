from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Union
import nltk
from collections import Counter
import json

# Asegúrate de descargar los recursos necesarios de NLTK si no lo has hecho
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

router = APIRouter()

class Module(BaseModel):
    level: int
    moduleName: str
    moduleInfo: str
    next: List[Union[str, None]] 

class ExtractedModules(BaseModel):
    modules: List[Module]

@router.post("/user/{id}/createPath", response_model=ExtractedModules)
def create_path(id: int, text: str):
    with open('financial_terms.json', 'r', encoding='utf-8') as file:
        financial_terms = json.load(file)

    def extract_keywords_to_modules(text: str) -> List[Module]:
        # Tokenizar el texto
        tokens = nltk.word_tokenize(text)
        # Etiquetar las partes del discurso
        tagged = nltk.pos_tag(tokens)

        # Filtrar solo los sustantivos
        keywords = [word for word, pos in tagged if pos in ('NN', 'NNS', 'NNP', 'NNPS')]

        valid_keywords = {term['name']: term['def'] for term in financial_terms}
        filtered_keywords = [keyword for keyword in keywords if keyword in valid_keywords]
        common_words = Counter(filtered_keywords).most_common(10)  # Obtener hasta 10 palabras comunes
        
        modules = []
        
        # Clasificar los módulos por nivel
        level_dict = {}

        for idx, (word, count) in enumerate(common_words):
            level = (idx // 2) + 1  # Determinar el nivel
            module = Module(
                level=level,
                moduleName=word,
                moduleInfo=valid_keywords[word],  
                next=[]  
            )
            modules.append(module)

            # Agregar el módulo al diccionario de niveles
            if level not in level_dict:
                level_dict[level] = []
            level_dict[level].append(module)

        # Actualizar el campo 'next' para cada módulo
        for module in modules:
            next_level = module.level + 1  # Siguiente nivel
            if next_level in level_dict:
                module.next = [next_module.moduleName for next_module in level_dict[next_level]]

        return modules

    modules = extract_keywords_to_modules(text)

    if not modules:
        raise HTTPException(status_code=400, detail="No se pudieron extraer módulos.")
    
    return {"Path": modules}
