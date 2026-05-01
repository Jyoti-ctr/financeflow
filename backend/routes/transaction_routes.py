from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import date
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/", response_model=List[schemas.TransactionOut])
def list_transactions(
    db: Session = Depends(get_db),
    user=Depends(auth.get_current_user),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
    type: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    q = db.query(models.Transaction).filter(models.Transaction.user_id == user.id)

    if start_date:
        q = q.filter(models.Transaction.date >= start_date)
    if end_date:
        q = q.filter(models.Transaction.date <= end_date)
    if category_id:
        q = q.filter(models.Transaction.category_id == category_id)
    if type:
        q = q.filter(models.Transaction.type == type)
    if search:
        q = q.filter(models.Transaction.description.ilike(f"%{search}%"))

    return q.order_by(models.Transaction.date.desc()).offset(skip).limit(limit).all()


@router.post("/", response_model=schemas.TransactionOut)
def create_transaction(t: schemas.TransactionCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    new_t = models.Transaction(user_id=user.id, **t.dict())
    db.add(new_t)
    db.commit()
    db.refresh(new_t)
    return new_t


@router.put("/{tid}", response_model=schemas.TransactionOut)
def update_transaction(tid: int, t: schemas.TransactionCreate, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    db_t = db.query(models.Transaction).filter(models.Transaction.id == tid, models.Transaction.user_id == user.id).first()
    if not db_t:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in t.dict().items():
        setattr(db_t, k, v)
    db.commit()
    db.refresh(db_t)
    return db_t


@router.delete("/{tid}")
def delete_transaction(tid: int, db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    db_t = db.query(models.Transaction).filter(models.Transaction.id == tid, models.Transaction.user_id == user.id).first()
    if not db_t:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(db_t)
    db.commit()
    return {"message": "Deleted"}