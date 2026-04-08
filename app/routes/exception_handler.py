from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.error(f"Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"}
    )