from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional


# ---------------- USER ----------------
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


# ---------------- CATEGORY ----------------
class CategoryCreate(BaseModel):
    name: str
    icon: Optional[str] = "📁"
    color: Optional[str] = "#6366f1"
    type: Optional[str] = "expense"


class CategoryOut(CategoryCreate):
    id: int

    class Config:
        from_attributes = True


# ---------------- TRANSACTION ----------------
class TransactionCreate(BaseModel):
    amount: float
    type: str
    description: Optional[str] = ""
    date: date
    category_id: Optional[int] = None


class TransactionOut(BaseModel):
    id: int
    amount: float
    type: str
    description: Optional[str]
    date: date
    category_id: Optional[int]
    category: Optional[CategoryOut]

    class Config:
        from_attributes = True