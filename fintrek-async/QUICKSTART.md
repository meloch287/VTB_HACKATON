# Быстрый старт - Финтрек Этап 3

## Минимальная настройка для запуска

### 1. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 2. Настройка .env файла

Создайте файл `.env` в корне проекта:

```env
# Основные настройки
PROJECT_NAME=FinTrek
VERSION=1.0.0
API_V1_STR=/api/v1

# База данных PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fintrek_db

# Безопасность
SECRET_KEY=your-super-secret-key-min-32-characters-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Ключ шифрования для токенов банков (32 символа)
ENCRYPTION_KEY=your-encryption-key-32-chars-

# Open Banking API (опционально для тестирования)
OPEN_BANKING_API_URL=https://api.example-bank.ru
OPEN_BANKING_CLIENT_ID=test_client_id
OPEN_BANKING_CLIENT_SECRET=test_client_secret

# Redis (опционально)
REDIS_URL=redis://localhost:6379/0

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]
```

### 3. Запуск PostgreSQL

**Вариант A: Docker**
```bash
docker run --name fintrek-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=fintrek_db \
  -p 5432:5432 \
  -d postgres:15
```

**Вариант B: Локальная установка**
```bash
# Создать базу данных
createdb fintrek_db
```

### 4. Применение миграций

```bash
alembic upgrade head
```

### 5. Создание системных категорий (опционально)

```bash
python scripts/init_categories.py
```

### 6. Запуск приложения

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 7. Проверка работы

Откройте в браузере:
- **API документация**: http://localhost:8000/docs
- **Альтернативная документация**: http://localhost:8000/redoc

## Быстрый тест API

### 1. Регистрация пользователя

```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }'
```

### 2. Вход в систему

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login?email=test@example.com&password=testpassword123"
```

Сохраните полученный `access_token`.

### 3. Создание счета

```bash
curl -X POST "http://localhost:8000/api/v1/accounts/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_name": "Основной счет",
    "account_type": "checking",
    "currency": "RUB",
    "balance": 50000.00
  }'
```

### 4. Получение списка категорий

```bash
curl -X GET "http://localhost:8000/api/v1/categories/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Создание транзакции

```bash
curl -X POST "http://localhost:8000/api/v1/transactions/" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "account_id": "YOUR_ACCOUNT_ID",
    "transaction_type": "expense",
    "amount": 500.00,
    "currency": "RUB",
    "description": "Покупка продуктов",
    "transaction_date": "2025-10-30T12:00:00"
  }'
```

## Возможные проблемы

### Ошибка подключения к PostgreSQL

**Решение**: Убедитесь что PostgreSQL запущен и параметры в `.env` корректны.

```bash
# Проверить статус PostgreSQL
sudo systemctl status postgresql

# Или для Docker
docker ps | grep postgres
```

### Ошибка "alembic: command not found"

**Решение**: Установите зависимости заново.

```bash
pip install --upgrade alembic
```

### Ошибка импорта модулей

**Решение**: Убедитесь что вы находитесь в корневой директории проекта.

```bash
cd /path/to/fintrek-stage3
export PYTHONPATH=$PYTHONPATH:$(pwd)
```

## Структура проекта

```
fintrek-stage3/
├── app/                    # Основной код приложения
│   ├── api/               # API эндпоинты
│   ├── core/              # Конфигурация и безопасность
│   ├── db/                # База данных
│   ├── models/            # SQLAlchemy модели
│   ├── schemas/           # Pydantic схемы
│   ├── services/          # Бизнес-логика
│   └── main.py            # Точка входа
├── alembic/               # Миграции БД
├── scripts/               # Вспомогательные скрипты
├── .env                   # Переменные окружения (создать)
├── requirements.txt       # Зависимости Python
└── README.md             # Полная документация
```

## Следующие шаги

1. Изучите полную документацию в `README.md`
2. Ознакомьтесь с деталями реализации в `STAGE3_IMPLEMENTATION.md`
3. Протестируйте все эндпоинты через Swagger UI
4. Интегрируйте с фронтендом
5. Настройте подключение к реальным банковским API

## Полезные ссылки

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Schema**: http://localhost:8000/openapi.json

## Поддержка

При возникновении проблем:
1. Проверьте логи приложения
2. Убедитесь что все зависимости установлены
3. Проверьте конфигурацию в `.env`
4. Изучите документацию в `README.md`
