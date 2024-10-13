# api/endpoints/user_endpoint.py
from fastapi import APIRouter, HTTPException
from services.database import db

router = APIRouter()

def create_user(email: str, password: str):
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).get()
    if query:
        raise HTTPException(status_code=400, detail="User already exists")

    user_data = {
        'email': email,
        'password': password  
    }
    doc_ref = users_ref.document()
    doc_ref.set(user_data)
    return doc_ref.id

def get_user_by_email(email: str):
    users_ref = db.collection('users')
    query = users_ref.where('email', '==', email).get()
    if query:
        user_doc = query[0]
        user_data = user_doc.to_dict()
        user_data['id'] = user_doc.id
        return user_data
    else:
        return None

@router.post("/signup/")
async def signup(user_data: dict):
    email = user_data.get('email')
    password = user_data.get('password')
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    user_id = create_user(email, password)
    return {"message": "User created successfully", "user_id": user_id}

@router.post("/login/")
async def login(login_data: dict):
    email = login_data.get('email')
    password = login_data.get('password')
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if password != user['password']:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return {"message": "Login successful", "user_id": user['id']}
