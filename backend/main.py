from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add this block right after you initialize 'app = FastAPI()'
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins to avoid blocking
    allow_credentials=False,
    allow_methods=["*"],  # Allows all HTTP methods (POST, GET, PUT, DELETE)
    allow_headers=["*"],  # Allows all headers
)

# ... the rest of your router inclusions (e.g., app.include_router(...))
from routes import auth_routes, transaction_routes, category_routes, report_routes
app.include_router(auth_routes.router)
app.include_router(transaction_routes.router)
app.include_router(category_routes.router)
app.include_router(report_routes.router)


@app.get("/")
def home():
    return {"message": "💰 FinanceFlow API running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True, host="0.0.0.0", port=8000)