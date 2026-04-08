from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

# Import routers
from app.routes import auth, user, wallet, transaction, audit, webhook,bank_account , withdrawal, admin_withdrawal, admin_audit, resolve

# Import DB
from app.services.database import Base, engine


# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FinTech App API",
    description="Secure backend API for a wallet, transactions, and user management",
    version="1.0.0",
)

FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(wallet.router, prefix="/wallets", tags=["Wallets"])
app.include_router(transaction.router, prefix="/transactions", tags=["Transactions"])
app.include_router(audit.router, prefix="/audit", tags=["Audit"])
app.include_router(webhook.router)
app.include_router(bank_account.router)
app.include_router(withdrawal.router)
app.include_router(admin_withdrawal.router)
app.include_router(admin_audit.router, prefix="/admin", tags=["Admin"])
app.include_router(resolve.router)

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")


@app.get("/")
def root():
    if FRONTEND_DIST.exists():
        return FileResponse(FRONTEND_DIST / "index.html")
    return {"message": "FinTech App API is live!"}

def root():
    return {"message": "FinTech App API is live!"}