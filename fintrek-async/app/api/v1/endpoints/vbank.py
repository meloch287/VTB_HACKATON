from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user
from app.db.session import get_db
from app.services.vbank_import import VBankImportService

router = APIRouter(prefix="/vbank", tags=["vbank"])

@router.post("/sync-accounts")
async def sync_accounts(
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = VBankImportService()
    await svc.fetch_accounts(db, user_id=current_user.id)
    await db.commit()
    return {"status": "ok"}

@router.post("/sync-transactions")
async def sync_transactions(
    account_id: str = Query(..., description="external account id из VBank"),
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    current_user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = VBankImportService()
    await svc.fetch_transactions(db, user_id=current_user.id, account_id=account_id, date_from=date_from, date_to=date_to)
    await db.commit()
    return {"status": "ok"}
