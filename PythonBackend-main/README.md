# FinPath
### Instrucciones de Instalación:
git clone https://github.com/Vikingos-Hack24/PythonBackend
git clone https://github.com/Vikingos-Hack24/Frontend


You have to activate the virtual environment located in venv/

Linux/MacOs:

$source venv/bin/activate

Once virtual environment, we need to download dependencies to this backend

To do that

$pip install -r requirements.txt

You are all set!

Now run:
  $uvicorn main:app --reload




## Introducción
Este proyecto consiste en una plataforma web de finanzas personales que analizar los perfiles financieros y comportamientos de los usuarios, adaptamos el contenido educativo en función de sus intereses, dudas o aclaraciones. Se personaliza el recorrido de aprendizaje y se ofrecen sugerencias de acciones, como opciones de inversión, prevención de fraudes y otros consejos útiles. Todo esto a través de una aplicación interactiva y sencilla, en la cual el usuario podra interactuar con un chat experto en las finanzas.

## Objetivo
El objetivo del proyecto es desarrollar una solución integral para la gestión financiera personal que permita a los usuarios no solo cargar y almacenar archivos financieros (como estados de cuenta o nóminas), sino también visualizar gráficos y obtener análisis predictivos sobre su situación financiera. Adicionalmente, los usuarios podrán completar cuestionarios de educación financiera que adaptarán los módulos de aprendizaje en función de su nivel de conocimiento.

## Alcance
  El proyecto cubre tanto el frontend como el backend de la plataforma, y sus características incluyen:

  - Registro y autenticación de usuarios con proveedores como Google, Apple o Facebook.
  - Cuestionarios interactivos de educación financiera, que personalizan una ruta de aprendizaje según el nivel de conocimiento del usuario.
  - Almacenamiento seguro de los datos de los usuarios mediante la integración con Google Cloud.
  - Evaluación dinámica de progreso, que ajusta los módulos de aprendizaje en función del rendimiento en los cuestionarios.
  - Chat con IA especializada en finanzas que proporciona respuestas personalizadas según el nivel de conocimiento del usuario y sus resultados en los cuestionarios.

## 2. Lengaujes y tecnologías Usadas
- Python
- React
- TypeScript
- Tailwind CSS
- FastAPI
- Google Cloud
- Gemini

## 3. Arquitectura del Proyecto
![PHOTO-2024-10-13-11-08-45](https://github.com/user-attachments/assets/f2c6132c-9be0-4bf5-b063-0a1be67de06d)

- Frontend: Desarrollado en React, Tailwind CSS y TypeScript.
- Backend: API's construidas en FastAPI.
- Base de datos: Almacenamiento en Firebase.


### Requisitos:
- Python 3.8+
- Activar el ambiente virtual venv
- Instalar los requirements
- Node.js 14+


#### 2. Iniciar el frontend: 
cd frontend
npm start


## 5. Funcionalidades Principales
- **Login de Usuarios**
- **Análisis de datos financieros**
- **Visualización de gráficos**

## 6. APIs y Endpoints
- `POST /login`: Autentica al usuario.
- `GET /reportes`: Devuelve los gráficos financieros del usuario.

## 7. Base de Datos
la base de datos es NOSQL por lo tanto se genera de manera automatica como va avanzando todo lo necesario, entonces es una base no relacional que contiene usuarios y cada coleccion es una representacion de cada informacion de los usuarios


## 8. Próximos Pasos
- Poder linkear el login a usuarios de Banorte.
- Si es usuario actual de Banorte, lo direccionara para poder gestionar sus finanzas, chequear graficos de historial financiero y ver las recomendaciones para poder invertir.
- Implementar medidas de seguridad en login o registro.
- Cuestionario inicial para conocer al usuario, que la IA adapte el contenido a las respuestas del usuario.
Dividir por categorias los conocimientos financieros del usuario: NOVATO, INTERMEDIO, EXPERTO. Si el user es NOVATO, se le direccionara al curso de educacion financiera.
- Implementar un análisis predictivo de acuerdo a los archivos financieros subidos.
- Seccion para mostrar un catalogo de opciones para que el usuario pueda saber en que invertir y 
como invertir de acuerdo a sus gustos, necesidades y estatus socioeconómico
asi lo desea.


=)

