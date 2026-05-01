from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from database import get_db
import models, auth
import csv
import io

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user.id).all()

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expense = sum(t.amount for t in transactions if t.type == "expense")
    balance = total_income - total_expense

    # Category breakdown (expenses)
    cat_breakdown = {}
    for t in transactions:
        if t.type == "expense" and t.category:
            key = t.category.name
            cat_breakdown[key] = cat_breakdown.get(key, 0) + t.amount

    # Last 6 months
    today = date.today()
    monthly = {}
    for i in range(5, -1, -1):
        m = today.month - i
        y = today.year
        while m <= 0:
            m += 12
            y -= 1
        key = f"{y}-{m:02d}"
        monthly[key] = {"income": 0, "expense": 0}

    for t in transactions:
        key = f"{t.date.year}-{t.date.month:02d}"
        if key in monthly:
            monthly[key][t.type] += t.amount

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "transaction_count": len(transactions),
        "category_breakdown": [{"name": k, "value": v} for k, v in cat_breakdown.items()],
        "monthly": [{"month": k, **v} for k, v in monthly.items()],
    }


@router.get("/export-csv")
def export_csv(db: Session = Depends(get_db), user=Depends(auth.get_current_user)):
    transactions = db.query(models.Transaction).filter(models.Transaction.user_id == user.id).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Type", "Category", "Amount", "Description"])
    for t in transactions:
        writer.writerow([
            t.date,
            t.type,
            t.category.name if t.category else "",
            t.amount,
            t.description or "",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"},
    )