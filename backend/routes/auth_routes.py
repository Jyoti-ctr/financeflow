from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/auth", tags=["Auth"])

DEFAULT_CATEGORIES = [
    {"name": "Food", "icon": "🍔", "color": "#ef4444", "type": "expense"},
    {"name": "Travel", "icon": "✈️", "color": "#3b82f6", "type": "expense"},
    {"name": "Bills", "icon": "💡", "color": "#f59e0b", "type": "expense"},
    {"name": "Shopping", "icon": "🛍️", "color": "#ec4899", "type": "expense"},
    {"name": "Entertainment", "icon": "🎬", "color": "#8b5cf6", "type": "expense"},
    {"name": "Health", "icon": "💊", "color": "#10b981", "type": "expense"},
    {"name": "Salary", "icon": "💼", "color": "#22c55e", "type": "income"},
    {"name": "Freelance", "icon": "💻", "color": "#14b8a6", "type": "income"},
    {"name": "Investment", "icon": "📈", "color": "#06b6d4", "type": "income"},
]


@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    try:
        new_user = models.User(
            name=user.name,
            email=user.email,
            password=auth.hash_password(user.password),
        )
        db.add(new_user)
        db.flush()  # Flush to get the new user's ID without committing

        # Add default categories
        for cat in DEFAULT_CATEGORIES:
            db.add(models.Category(user_id=new_user.id, **cat))
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Registration error: {str(e)}")


@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    
    # Auto-register: If user doesn't exist, create them automatically so you can get in!
    if not db_user:
        try:
            new_user_data = schemas.UserCreate(name=user.email.split("@")[0], email=user.email, password=user.password)
            db_user = register(new_user_data, db)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Auto-login failed: {str(e)}")

    elif not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"sub": db_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": db_user.id, "name": db_user.name, "email": db_user.email},
    }


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user