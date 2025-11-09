"""
Pydantic схемы для Transaction
"""
from pydantic import BaseModel, UUID4, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional
from app.models.transaction import TransactionType, TransactionStatus


class TransactionBase(BaseModel):
    """Базовая схема транзакции"""
    transaction_type: TransactionType = Field(..., description="Тип транзакции")
    amount: Decimal = Field(..., gt=0, description="Сумма транзакции")
    currency: str = Field(default="RUB", max_length=3, description="Валюта (ISO 4217)")
    description: Optional[str] = Field(None, max_length=500, description="Описание транзакции")
    merchant_name: Optional[str] = Field(None, max_length=200, description="Название продавца")
    notes: Optional[str] = Field(None, description="Заметки пользователя")
    transaction_date: datetime = Field(..., description="Дата транзакции")


class TransactionCreate(TransactionBase):
    """Схема для создания транзакции"""
    account_id: UUID4 = Field(..., description="ID счета")
    category_id: Optional[UUID4] = Field(None, description="ID категории")
    related_account_id: Optional[UUID4] = Field(None, description="ID связанного счета (для переводов)")


class TransactionUpdate(BaseModel):
    """Схема для обновления транзакции"""
    category_id: Optional[UUID4] = None
    description: Optional[str] = Field(None, max_length=500)
    notes: Optional[str] = None
    status: Optional[TransactionStatus] = None


class TransactionResponse(TransactionBase):
    """Схема ответа с транзакцией"""
    id: UUID4
    user_id: UUID4
    account_id: UUID4
    category_id: Optional[UUID4]
    related_account_id: Optional[UUID4]
    posted_date: Optional[datetime]
    status: TransactionStatus
    external_id: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TransactionListResponse(BaseModel):
    """Схема для списка транзакций"""
    transactions: list[TransactionResponse]
    total: int
    page: int
    page_size: int


class TransactionFilter(BaseModel):
    """Схема для фильтрации транзакций"""
    account_id: Optional[UUID4] = None
    category_id: Optional[UUID4] = None
    transaction_type: Optional[TransactionType] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None
