from fastapi import HTTPException

user_progreso = {
    "user1@example.com": {"current_module": 1, "completed_modules": []}
}

modules = {
    1: "Introducción a las Finanzas Personales",
    2: "Planificación Financiera",
    3: "Productos Financieros",
    4: "Inversiones",
    5: "Gestión de Deudas"
}

# Función para evaluar el cuestionario
def evaluar_quiz(respuesta):
    # Aquí podrías hacer análisis más avanzado, por ejemplo usando IA
    if respuesta.marcador >= 70:
        return {"pass": True}
    else:
        return {"pass": False}

# Función para obtener el siguiente módulo
def get_next_module(email):
    if email not in user_progreso:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    progreso = user_progreso[email]
    progreso["completed_modules"].append(progreso["current_module"])
    progreso["current_module"] += 1
    return progreso["current_module"]
