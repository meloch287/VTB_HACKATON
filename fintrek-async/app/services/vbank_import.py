from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.clients.vbank import get_vbank_client
from app import models

class VBankImportService:
    def __init__(self):
        self.client = get_vbank_client()

    async def fetch_accounts(self, db: AsyncSession, user_id):
        payload = await self.client.get_accounts()
        # ожидаем структуру наподобие {"accounts":[{id, iban, currency, balance, name, ...}, ...]}
        for a in payload.get("accounts", []):
            # находим/создаем account (привяжем к user_id)
            acc = await db.scalar(
                models.Account.select().where(models.Account.user_id == user_id, models.Account.external_id == a["id"])
            )
            if not acc:
                acc = models.Account(
                    user_id=user_id,
                    external_id=a["id"],
                    name=a.get("name") or a.get("product") or "VBank account",
                    currency=a.get("currency") or "RUB",
                    balance=a.get("balance", 0),
                    provider="vbank",
                    status=models.AccountStatus.active,
                )
                db.add(acc)
            else:
                acc.balance = a.get("balance", acc.balance)
                acc.currency = a.get("currency", acc.currency)
                acc.name = a.get("name") or acc.name
        await db.flush()

    async def fetch_transactions(self, db: AsyncSession, user_id, account_id: str, date_from: Optional[str] = None, date_to: Optional[str] = None):
        payload = await self.client.get_transactions(account_id, date_from=date_from, date_to=date_to)
        # ожидаем {"transactions":[{id, amount, currency, bookingDate, description, category, ...}, ...]}
        for t in payload.get("transactions", []):
            tx = await db.scalar(
                models.Transaction.select().where(
                    models.Transaction.user_id == user_id,
                    models.Transaction.external_id == t["id"],
                )
            )
            if not tx:
                tx = models.Transaction(
                    user_id=user_id,
                    account_external_id=account_id,
                    external_id=t["id"],
                    amount=t.get("amount", 0),
                    currency=t.get("currency", "RUB"),
                    occurred_at=t.get("bookingDate") or t.get("valueDate"),
                    description=t.get("description") or "",
                    category_guess=t.get("category"),
                    provider="vbank",
                    status=models.TransactionStatus.posted,
                    type=models.TransactionType.income if float(t.get("amount", 0)) >= 0 else models.TransactionType.expense,
                )
                db.add(tx)
            else:
                tx.amount = t.get("amount", tx.amount)
                tx.description = t.get("description", tx.description)
        await db.flush()
