from __future__ import annotations
import asyncio
import time
from typing import Any, Dict, Optional

import httpx
from app.core.config import settings

class VBankAuth:
    def __init__(self, base_url: str, client_id: str, client_secret: str, bank_code: str):
        self.base_url = base_url.rstrip("/")
        self.client_id = client_id
        self.client_secret = client_secret
        self.bank_code = bank_code
        self._access_token: Optional[str] = None
        self._exp_ts: float = 0.0
        self._lock = asyncio.Lock()

    async def token(self, http: httpx.AsyncClient) -> str:
        async with self._lock:
            now = time.time()
            if self._access_token and now < self._exp_ts - 30:
                return self._access_token

            # Шаг 1: получить bank-token
            # По их docs — POST /auth/bank-token (Bearer не требуется)
            # Точное тело зависит от провайдера, в песочнице часто это client_id/secret/bank_code.
            payload = {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "bank": self.bank_code,
            }
            resp = await http.post(f"{self.base_url}/auth/bank-token", json=payload, timeout=20.0)
            resp.raise_for_status()
            data = resp.json()
            # типичные поля: access_token / expires_in
            self._access_token = data.get("access_token") or data.get("token")
            ttl = int(data.get("expires_in", 1800))
            self._exp_ts = now + ttl
            return self._access_token


class VBankClient:
    def __init__(self, base_url: str, client_id: str, client_secret: str, bank_code: str):
        self.base_url = base_url.rstrip("/")
        self._auth = VBankAuth(base_url, client_id, client_secret, bank_code)
        self._http = httpx.AsyncClient(base_url=self.base_url, timeout=30.0)

    async def _headers(self) -> Dict[str, str]:
        token = await self._auth.token(self._http)
        return {"Authorization": f"Bearer {token}"}

    async def get_accounts(self) -> Dict[str, Any]:
        # примерный путь — в sandbox обычно /accounts или /client/accounts
        # если у них другой — поправим одну строку тут, без касания остального кода
        r = await self._http.get("/accounts", headers=await self._headers())
        r.raise_for_status()
        return r.json()

    async def get_transactions(self, account_id: str, date_from: Optional[str] = None, date_to: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if date_from: params["dateFrom"] = date_from
        if date_to: params["dateTo"] = date_to
        # частый профиль: /accounts/{id}/transactions
        r = await self._http.get(f"/accounts/{account_id}/transactions", params=params, headers=await self._headers())
        r.raise_for_status()
        return r.json()

    async def aclose(self):
        await self._http.aclose()


# Фабрика-одиночка
_vbank_singleton: Optional[VBankClient] = None

def get_vbank_client() -> VBankClient:
    global _vbank_singleton
    if _vbank_singleton is None:
        _vbank_singleton = VBankClient(
            base_url=settings.VBANK_BASE_URL,
            client_id=settings.VBANK_CLIENT_ID,
            client_secret=settings.VBANK_CLIENT_SECRET,
            bank_code=settings.VBANK_BANK_CODE,
        )
    return _vbank_singleton
