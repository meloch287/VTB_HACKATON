"""
Утилиты для работы с безопасностью
Хеширование паролей и работа с JWT токенами
"""
from datetime import datetime, timedelta
from typing import Optional, Union
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

# Контекст для хеширования паролей с использованием bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Проверка соответствия пароля его хешу
    
    Args:
        plain_password: Пароль в открытом виде
        hashed_password: Хешированный пароль из БД
        
    Returns:
        True если пароль совпадает, иначе False
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Хеширование пароля
    
    Args:
        password: Пароль в открытом виде
        
    Returns:
        Хешированный пароль
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Создание JWT access токена
    
    Args:
        data: Данные для включения в токен (обычно user_id)
        expires_delta: Время жизни токена (если не указано, используется значение из настроек)
        
    Returns:
        JWT токен в виде строки
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Создание JWT refresh токена
    
    Args:
        data: Данные для включения в токен (обычно user_id)
        
    Returns:
        JWT refresh токен в виде строки
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """
    Декодирование JWT токена
    
    Args:
        token: JWT токен
        
    Returns:
        Словарь с данными из токена или None в случае ошибки
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


from cryptography.fernet import Fernet
import base64


def get_encryption_key() -> bytes:
    """
    Получить ключ шифрования из настроек
    
    Returns:
        Ключ шифрования в байтах
    """
    # В реальном приложении ключ должен храниться в переменных окружения
    # и быть сгенерирован с помощью Fernet.generate_key()
    key = getattr(settings, "ENCRYPTION_KEY", settings.SECRET_KEY)
    
    # Преобразовать ключ в формат, подходящий для Fernet (32 байта в base64)
    if len(key) < 32:
        key = key.ljust(32, '0')
    else:
        key = key[:32]
    
    return base64.urlsafe_b64encode(key.encode())


def encrypt_token(token: str) -> str:
    """
    Зашифровать токен для безопасного хранения в БД
    
    Args:
        token: Токен в открытом виде
        
    Returns:
        Зашифрованный токен
    """
    f = Fernet(get_encryption_key())
    encrypted = f.encrypt(token.encode())
    return encrypted.decode()


def decrypt_token(encrypted_token: str) -> str:
    """
    Расшифровать токен из БД
    
    Args:
        encrypted_token: Зашифрованный токен
        
    Returns:
        Токен в открытом виде
    """
    f = Fernet(get_encryption_key())
    decrypted = f.decrypt(encrypted_token.encode())
    return decrypted.decode()
