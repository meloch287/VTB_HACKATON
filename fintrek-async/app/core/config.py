"""
Конфигурация приложения
Загружает переменные окружения и предоставляет настройки для всего приложения
"""
from pydantic import Field
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Настройки приложения"""
    
    # Основные настройки
    PROJECT_NAME: str = "Финтрек API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # База данных PostgreSQL
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "zxmnpoqw55"
    POSTGRES_DB: str = "fintrek_db"
    POSTGRES_PORT: str = "5432"

    VBANK_BASE_URL: str = Field("https://vbank.open.bankingapi.ru")
    VBANK_CLIENT_ID: str = Field("", description="VBank client id")
    VBANK_CLIENT_SECRET: str = Field("", description="VBank client secret")
    VBANK_BANK_CODE: str = Field("VBank")
    
    @property
    def DATABASE_URL(self) -> str:
        """Формирование URL для подключения к БД"""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """Формирование async URL для подключения к БД"""
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    @property
    def REDIS_URL(self) -> str:
        """Формирование URL для подключения к Redis"""
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
    
    # JWT настройки
    SECRET_KEY: str = "your-secret-key-change-this-in-production-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 минут
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # 7 дней
    
    # CORS
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:8000",
        "http://localhost:8080",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Создаем глобальный экземпляр настроек
settings = Settings()
