# Fintech Wallet Backend API

A secure, auditable wallet system inspired by modern fintech platforms (e.g., Opay, PalmPay).  
Built with **FastAPI** and **PostgreSQL**, this backend enforces strong security, precise currency handling, and robust transaction auditing.

---

## 🚀 Features
- **JWT authentication** with role-based access
- **One-wallet-per-user** enforcement
- **Dollar-based wallet** with cent-level precision
- **Idempotent deposits, withdrawals, and transfers**
- **Row-level locking** to prevent race conditions
- **Double-entry style transfers**
- **Full transaction ledger**
- **Admin audit & balance reconciliation**

---

## 🛠 Tech Stack
- **FastAPI** (Python web framework)
- **PostgreSQL** (relational database)
- **SQLAlchemy** (ORM)
- **JWT (HS256)** (authentication)
- **Argon2** (password hashing)
- **Currency Handling (NGN)**

---

## 💰 Currency Handling
All monetary values are stored in **kobo** (`₦ × 100`) to prevent floating-point errors.

Examples:
- ₦1.00 → `100 kobo`
- ₦12,500.50 → `1,250,050 kobo`

Frontend handles conversion to naira.

Dollar wallet example:
- $30.45 → `1000 cents`

---

## 🔒 Security Considerations
- **Idempotency keys** prevent duplicate transactions
- **Wallet row locking** prevents double-spend
- **Auditing endpoints** detect ledger mismatches

---

## 📈 Future Improvements
- Payment gateway integration
- KYC & AML compliance
- Alembic migrations
- Webhook handling

---

