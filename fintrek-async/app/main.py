"""
Главный файл FastAPI приложения
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.cache import init_cache, close_cache

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    # Стартуем
    await init_cache()
    yield
    # Завершаем
    await close_cache()

# Создание экземпляра FastAPI приложения
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    📊 **Финтрек API** - Интеллектуальная платформа для управления личными финансами
    
    ## Возможности
    
    * **Аутентификация** - Регистрация, вход и управление JWT токенами
    * **Управление счетами** - CRUD операции для банковских счетов
    * **Транзакции** - Учет доходов и расходов с фильтрацией
    * **Категории** - Классификация транзакций
    * **Аналитика** - Агрегированные данные о финансах
    * **AI-Инсайты** - Персонализированные рекомендации и прогнозы
    * **Open Banking** - Интеграция с банковскими API
    
    ## Технологии
    
    * FastAPI + SQLAlchemy + PostgreSQL
    * Redis для кэширования
    * JWT аутентификация
    * AI/ML для анализа и рекомендаций
    """,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    contact={
        "name": "Команда Финтрек",
        "email": "support@fintrek.com"
    },
    license_info={
        "name": "MIT"
    }
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение роутеров
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """Корневой эндпоинт для проверки работоспособности API"""
    return {
        "message": "Добро пожаловать в Финтрек API",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check эндпоинт"""
    return {"status": "healthy"}
