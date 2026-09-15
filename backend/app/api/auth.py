from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Player Authentication"])

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    username: str
    password: str
    department: str = "Alpha IT"

@router.post("/login")
def login(req: LoginRequest):
    """
    Player Login Portal API (Figure 7.1).
    """
    if not req.username_or_email or not req.password:
        raise HTTPException(status_code=400, detail="Username/Email and Password are required")

    return {
        "success": True,
        "message": "Login successful!",
        "token": "bearer-token-pixel-dash-12345",
        "user": {
            "id": "EMP-1000",
            "name": "Sona VR",
            "email": req.username_or_email,
            "username": "sona@pixel.com",
            "department": "Alpha IT",
            "role": "Lead Developer",
            "points": 2500,
            "level": 3,
            "avatar": "default_avatar"
        }
    }

@router.post("/register")
def register(req: RegisterRequest):
    """
    Player Registration API (Figure 7.1).
    """
    return {
        "success": True,
        "message": "Account created successfully!",
        "user": {
            "id": "EMP-1099",
            "name": req.name or "Sona VR",
            "email": req.email,
            "username": req.username,
            "department": req.department,
            "points": 500,
            "level": 1
        }
    }
