from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.services import models


def get_existing_transaction(
    db: Session,
    wallet_id: int,
    idempotency_key: str,
):
    """
    Check if a transaction already exists for a given wallet
    and idempotency key.

    This helps prevent duplicate transactions when the same
    request is sent multiple times.
    """

    return (
        db.query(models.Transaction)  # Query the Transaction table
        .filter(
            models.Transaction.wallet_id == wallet_id,        # Match wallet ID
            models.Transaction.idempotency_key == idempotency_key,  # Match idempotency key
        )
        .first()  # Return the first matching record or None
    )


def save_transaction(db: Session, tx: models.Transaction):
    """
    Save a new transaction to the database.

    Uses flush() to send the INSERT to the database before commit
    so that constraint errors (like duplicate keys) are caught early.
    """

    try:
        db.add(tx)    
        db.flush()   
        return tx      
    except IntegrityError:
        # If a database constraint error occurs (e.g. duplicate idempotency key)
        db.rollback()  # Undo any changes in the current transaction
        raise        