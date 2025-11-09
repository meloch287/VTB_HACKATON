"""
Настройка Redis для кэширования
"""
import redis.asyncio as redis
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from app.core.config import settings


async def init_cache():
    """
    Инициализация кэша при старте приложения
    """
    redis_client = redis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True
    )
    FastAPICache.init(RedisBackend(redis_client), prefix="fintrek-cache:")


async def close_cache():
    """
    Закрытие соединения с Redis при остановке приложения
    """
    await FastAPICache.clear()
