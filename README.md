# FinTech Frontend

A React + Tailwind UI frontend for the FastAPI FinTech backend.

## Setup

1. Open a terminal in `frontend`.
2. Run `npm install`.
3. Run `npm run dev`.

## Backend base URL

This frontend connects to the backend at `http://localhost:8000`.

## Features

- Login / register with email and password
- Wallet creation and balance display
- Deposit and withdrawal using idempotency header
- Recent transactions panel

## Notes

- The frontend uses Axios for API requests.
- Authentication token is stored in `localStorage`.
- If the backend is running on a different port or host, update `src/api/axios.js`.
