from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    return db.query(models.Category).filter(models.Category.user_id == user.id).all()


@router.post("/", response_model=schemas.CategoryOut)
def create_category(cat: schemas.CategoryCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    new_cat = models.Category(user_id=user.id, **cat.dict())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat


@router.put("/{cat_id}", response_model=schemas.CategoryOut)
def update_category(cat_id: int, cat: schemas.CategoryCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    db_cat = db.query(models.Category).filter(models.Category.id == cat_id, models.Category.user_id == user.id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    for k, v in cat.dict().items():
        setattr(db_cat, k, v)
    db.commit()
    db.refresh(db_cat)
    return db_cat


@router.delete("/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    db_cat = db.query(models.Category).filter(models.Category.id == cat_id, models.Category.user_id == user.id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"message": "Deleted"}