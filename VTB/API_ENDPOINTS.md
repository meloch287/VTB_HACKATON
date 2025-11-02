# API Endpoints для VTB Finance Frontend

## Base URL
```
http://localhost:8000/api
https://api.vtbbank.ru/api (production)
```

---

## 1. Authentication (Аутентификация)

### POST /auth/login
Вход в систему
```json
Request:
{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "Александр",
    "lastName": "Иванов"
  }
}
```

### POST /auth/register
Регистрация нового пользователя
```json
Request:
{
  "email": "user@example.com",
  "password": "password",
  "firstName": "Александр",
  "lastName": "Иванов",
  "phone": "+7 (999) 123-45-67"
}

Response:
{
  "token": "jwt_token",
  "refreshToken": "refresh_token",
  "user": { ... }
}
```

### POST /auth/logout
Выход из системы
```json
Response:
{
  "message": "Successfully logged out"
}
```

### POST /auth/refresh
Обновление токена
```json
Request:
{
  "refreshToken": "refresh_token"
}

Response:
{
  "token": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

---

## 2. Profile (Профиль пользователя)

### GET /profile
Получить информацию о профиле текущего пользователя
```json
Response:
{
  "id": "user_id",
  "email": "alexandr@example.com",
  "firstName": "Александр",
  "lastName": "Иванов",
  "phone": "+7 (999) 123-45-67",
  "avatar": "url_to_avatar",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-11-02T14:30:00Z"
}
```

### PUT /profile
Обновить информацию профиля
```json
Request:
{
  "firstName": "Александр",
  "lastName": "Иванов",
  "phone": "+7 (999) 123-45-67"
}

Response:
{
  "id": "user_id",
  "email": "alexandr@example.com",
  "firstName": "Александр",
  "lastName": "Иванов",
  "phone": "+7 (999) 123-45-67",
  "updatedAt": "2024-11-02T14:30:00Z"
}
```

### POST /profile/avatar
Загрузить аватар профиля
```
Request: multipart/form-data
- file: File

Response:
{
  "avatar": "url_to_new_avatar",
  "message": "Avatar updated successfully"
}
```

### POST /profile/delete
Удалить аккаунт (с подтверждением пароля)
```json
Request:
{
  "password": "password"
}

Response:
{
  "message": "Account successfully deleted"
}
```

---

## 3. Accounts (Счета)

### GET /accounts
Получить все счета пользователя
```json
Response:
{
  "accounts": [
    {
      "id": "account_1",
      "name": "Основной счет",
      "bank": "ВТБ",
      "balance": 125000,
      "currency": "RUB",
      "accountNumber": "•••• 4567",
      "type": "checking",
      "status": "active",
      "createdAt": "2024-01-15T10:00:00Z"
    },
    {
      "id": "account_2",
      "name": "Сбережения",
      "bank": "Сбербанк",
      "balance": 350000,
      "currency": "RUB",
      "accountNumber": "•••• 8901",
      "type": "savings",
      "status": "active",
      "createdAt": "2024-02-10T10:00:00Z"
    },
    {
      "id": "account_3",
      "name": "Инвестиционный",
      "bank": "Тинькофф",
      "balance": 580000,
      "currency": "RUB",
      "accountNumber": "•••• 2345",
      "type": "investment",
      "status": "active",
      "createdAt": "2024-03-20T10:00:00Z"
    }
  ]
}
```

### GET /accounts/:id
Получить информацию о конкретном счете
```json
Response:
{
  "id": "account_1",
  "name": "Основной счет",
  "bank": "ВТБ",
  "balance": 125000,
  "currency": "RUB",
  "accountNumber": "•••• 4567",
  "type": "checking",
  "status": "active",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### POST /accounts/connect
Подключить новый банк (через VTB Open API)
```json
Request:
{
  "bankId": "vtb",
  "authCode": "auth_code_from_bank"
}

Response:
{
  "id": "account_4",
  "name": "ВТБ Счет",
  "bank": "ВТБ",
  "balance": 200000,
  "status": "connected"
}
```

### DELETE /accounts/:id
Отключить счет
```json
Response:
{
  "message": "Account successfully disconnected"
}
```

---

## 4. Dashboard (Главная панель)

### GET /dashboard/summary
Получить сводку финансового состояния
```json
Response:
{
  "totalBalance": 1040000,
  "accountsSummary": [
    {
      "name": "Основной",
      "amount": 125000,
      "type": "checking",
      "color": "hsl(175 100% 39%)"
    },
    {
      "name": "Сбережения",
      "amount": 350000,
      "type": "savings",
      "color": "hsl(215 76% 16%)"
    },
    {
      "name": "Инвестиции",
      "amount": 580000,
      "type": "investment",
      "color": "hsl(175 80% 50%)"
    },
    {
      "name": "Кредитная",
      "amount": -15000,
      "type": "credit",
      "color": "hsl(0 84% 60%)"
    }
  ],
  "financialScore": 78,
  "scoreChange": 5
}
```

### GET /dashboard/income-expenses
Получить данные о доходах и расходах
```json
Response:
{
  "incomeExpenseData": [
    {
      "month": "Янв",
      "income": 120000,
      "expenses": 85000
    },
    {
      "month": "Фев",
      "income": 130000,
      "expenses": 92000
    },
    {
      "month": "Мар",
      "income": 125000,
      "expenses": 88000
    },
    {
      "month": "Апр",
      "income": 140000,
      "expenses": 95000
    },
    {
      "month": "Май",
      "income": 135000,
      "expenses": 90000
    },
    {
      "month": "Июн",
      "income": 150000,
      "expenses": 98000
    }
  ]
}
```

### GET /dashboard/category-breakdown
Получить данные о расходах по категориям
```json
Response:
{
  "categoryData": [
    {
      "name": "Продукты",
      "value": 25000,
      "percentage": 28,
      "color": "hsl(175 100% 39%)"
    },
    {
      "name": "Транспорт",
      "value": 15000,
      "percentage": 17,
      "color": "hsl(215 76% 16%)"
    },
    {
      "name": "Развлечения",
      "value": 18000,
      "percentage": 20,
      "color": "hsl(175 80% 50%)"
    },
    {
      "name": "Подписки",
      "value": 8000,
      "percentage": 9,
      "color": "hsl(215 60% 25%)"
    },
    {
      "name": "Прочее",
      "value": 12000,
      "percentage": 14,
      "color": "hsl(215 20% 93%)"
    }
  ]
}
```

---

## 5. Transfers (Переводы)

### GET /transfers/history
Получить историю переводов с фильтрацией
```json
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- type: "incoming" | "outgoing" | "all" (default: "all")
- category: string (default: "all")
- bank: string (default: "all")
- startDate: ISO 8601 date
- endDate: ISO 8601 date
- search: string

Response:
{
  "transactions": [
    {
      "id": "tx_1",
      "date": "2025-10-28",
      "type": "outgoing",
      "recipient": "Иван Петров",
      "amount": 5000,
      "category": "Перевод другу",
      "status": "completed",
      "bank": "ВТБ",
      "comment": "Долг"
    },
    {
      "id": "tx_2",
      "date": "2025-10-27",
      "type": "incoming",
      "recipient": "Зарплата",
      "amount": 120000,
      "category": "Доход",
      "status": "completed",
      "bank": "ВТБ"
    }
  ],
  "total": 150,
  "page": 1,
  "pages": 8
}
```

### POST /transfers/create
Создать новый перевод
```json
Request:
{
  "accountId": "account_1",
  "recipient": "Иван Петров",
  "amount": 5000,
  "category": "Перевод другу",
  "comment": "Долг",
  "recipientType": "phone" | "card" | "account"
}

Response:
{
  "id": "tx_123",
  "status": "pending",
  "date": "2025-11-02T14:30:00Z",
  "amount": 5000,
  "recipient": "Иван Петров",
  "message": "Перевод успешно отправлен"
}
```

### GET /transfers/templates
Получить сохраненные шаблоны переводов
```json
Response:
{
  "templates": [
    {
      "id": "template_1",
      "name": "Аренда квартиры",
      "recipient": "Агентство Недвижимости",
      "amount": 50000,
      "category": "Жилье"
    },
    {
      "id": "template_2",
      "name": "Мама",
      "recipient": "Анна Иванова",
      "amount": 20000,
      "category": "Семья"
    },
    {
      "id": "template_3",
      "name": "Коммунальные",
      "recipient": "ЖКХ Сервис",
      "amount": 8000,
      "category": "Жилье"
    }
  ]
}
```

### POST /transfers/templates
Создать новый шаблон перевода
```json
Request:
{
  "name": "Аренда квартиры",
  "recipient": "Агентство Недвижимости",
  "amount": 50000,
  "category": "Жилье"
}

Response:
{
  "id": "template_4",
  "name": "Аренда квартиры",
  "recipient": "Агентство Недвижимости",
  "amount": 50000,
  "category": "Жилье"
}
```

### DELETE /transfers/templates/:id
Удалить шаблон перевода
```json
Response:
{
  "message": "Template successfully deleted"
}
```

### POST /transfers/apply-template
Применить шаблон и создать перевод
```json
Request:
{
  "templateId": "template_1",
  "accountId": "account_1"
}

Response:
{
  "id": "tx_456",
  "status": "pending",
  "amount": 50000,
  "recipient": "Агентство Недвижимости"
}
```

### GET /transfers/analytics
Получить аналитику по переводам
```json
Query Parameters:
- period: "month" | "year" | "custom" (default: "month")
- startDate: ISO 8601 date
- endDate: ISO 8601 date

Response:
{
  "transferAnalytics": [
    {
      "name": "Переводы друзьям",
      "value": 45000,
      "count": 12,
      "percentage": 35
    },
    {
      "name": "Платежи ЖКХ",
      "value": 24000,
      "count": 3,
      "percentage": 18
    },
    {
      "name": "Подписки",
      "value": 5000,
      "count": 8,
      "percentage": 4
    },
    {
      "name": "Прочее",
      "value": 15000,
      "count": 7,
      "percentage": 11
    }
  ],
  "totalAmount": 129000,
  "totalCount": 30,
  "monthlyActivity": [
    {
      "month": "Янв",
      "outgoing": 85000,
      "incoming": 120000
    },
    {
      "month": "Фев",
      "outgoing": 92000,
      "incoming": 130000
    }
  ]
}
```

---

## 6. Analytics (Аналитика)

### GET /analytics/expenses
Получить данные о расходах с фильтрацией
```json
Query Parameters:
- period: "week" | "month" | "year" | "custom"
- startDate: ISO 8601 date
- endDate: ISO 8601 date

Response:
{
  "summary": {
    "totalExpenses": 94000,
    "averageCheck": 1567,
    "topCategory": {
      "name": "Продукты",
      "value": 29000,
      "percentage": 31
    },
    "changePercent": 12
  },
  "monthlyData": [
    {
      "month": "Янв",
      "Продукты": 25000,
      "Транспорт": 15000,
      "Развлечения": 18000,
      "Подписки": 8000,
      "Прочее": 12000
    }
  ],
  "trendData": [
    {
      "month": "Янв",
      "value": 78000
    },
    {
      "month": "Фев",
      "value": 82000
    }
  ]
}
```

### GET /analytics/income
Получить данные о доходах
```json
Response:
{
  "totalIncome": 150000,
  "sources": [
    {
      "name": "Зарплата",
      "value": 150000,
      "percentage": 90
    },
    {
      "name": "Фриланс",
      "value": 10000,
      "percentage": 6
    },
    {
      "name": "Дивиденды",
      "value": 5000,
      "percentage": 3
    }
  ]
}
```

### GET /analytics/transactions
Получить список транзакций для аналитики
```json
Query Parameters:
- page: number
- limit: number
- category: string
- type: "income" | "expense"
- startDate: ISO 8601 date
- endDate: ISO 8601 date

Response:
{
  "transactions": [
    {
      "date": "2024-06-15",
      "category": "Продукты",
      "merchant": "Пятёрочка",
      "amount": -2500,
      "type": "expense"
    }
  ],
  "total": 500,
  "page": 1,
  "pages": 25
}
```

### GET /analytics/budget-comparison
Получить сравнение с планом бюджета
```json
Response:
{
  "budgetComparison": [
    {
      "category": "Продукты",
      "planned": 30000,
      "actual": 29000,
      "difference": 1000,
      "percentageUsed": 96.67
    },
    {
      "category": "Транспорт",
      "planned": 15000,
      "actual": 18000,
      "difference": -3000,
      "percentageUsed": 120
    }
  ]
}
```

---

## 7. Investments (Инвестиции)

### GET /investments/portfolio
Получить информацию о портфеле
```json
Response:
{
  "summary": {
    "totalAssets": 580000,
    "returnPercentage": 8.5,
    "esgScore": 78,
    "dividends": 12400
  },
  "portfolioData": [
    {
      "name": "Акции",
      "value": 350000,
      "percentage": 60,
      "color": "hsl(175 100% 39%)"
    },
    {
      "name": "Облигации",
      "value": 116000,
      "percentage": 20,
      "color": "hsl(215 76% 16%)"
    },
    {
      "name": "ETF",
      "value": 87000,
      "percentage": 15,
      "color": "hsl(175 80% 50%)"
    },
    {
      "name": "Наличные",
      "value": 29000,
      "percentage": 5,
      "color": "hsl(215 60% 25%)"
    }
  ]
}
```

### GET /investments/holdings
Получить список активов в портфеле
```json
Response:
{
  "holdings": [
    {
      "name": "Apple Inc.",
      "ticker": "AAPL",
      "shares": 50,
      "price": 4200,
      "change": 2.5,
      "changeType": "positive",
      "esgScore": 85
    },
    {
      "name": "Сбербанк",
      "ticker": "SBER",
      "shares": 200,
      "price": 285,
      "change": -1.2,
      "changeType": "negative",
      "esgScore": 72
    },
    {
      "name": "ВТБ",
      "ticker": "VTBR",
      "shares": 500,
      "price": 3.5,
      "change": 0.8,
      "changeType": "positive",
      "esgScore": 68
    },
    {
      "name": "Яндекс",
      "ticker": "YNDX",
      "shares": 15,
      "price": 3800,
      "change": 3.4,
      "changeType": "positive",
      "esgScore": 78
    }
  ]
}
```

### GET /investments/performance
Получить данные о производительности портфеля
```json
Query Parameters:
- period: "month" | "year" | "all" (default: "month")

Response:
{
  "performanceData": [
    {
      "month": "Янв",
      "value": 500000
    },
    {
      "month": "Фев",
      "value": 520000
    },
    {
      "month": "Мар",
      "value": 510000
    },
    {
      "month": "Апр",
      "value": 545000
    },
    {
      "month": "Май",
      "value": 560000
    },
    {
      "month": "Июн",
      "value": 580000
    }
  ]
}
```

### POST /investments/rebalance
Выполнить ребалансировку портфеля
```json
Request:
{
  "strategy": "conservative" | "moderate" | "aggressive"
}

Response:
{
  "message": "Portfolio rebalancing initiated",
  "suggestedChanges": [
    {
      "asset": "Акции",
      "currentPercentage": 60,
      "suggestedPercentage": 50
    },
    {
      "asset": "Облигации",
      "currentPercentage": 20,
      "suggestedPercentage": 30
    }
  ]
}
```

### GET /investments/esg-score
Получить ESG оценку портфеля
```json
Response:
{
  "overallScore": 78,
  "environmental": 82,
  "social": 75,
  "governance": 77,
  "recommendation": "Ваш портфель имеет хороший ESG-рейтинг. Рекомендуем добавить зелёные облигации для улучшения экологической составляющей."
}
```

---

## 8. Planner (Планировщик "Что если?")

### POST /planner/calculate
Рассчитать финансовый сценарий
```json
Request:
{
  "scenarioType": "vacation" | "car" | "apartment" | "education",
  "amount": 200000,
  "months": 12,
  "currentSavings": 350000,
  "monthlyIncome": 150000,
  "monthlyExpenses": 94000
}

Response:
{
  "monthlyPayment": 16666.67,
  "currentSavings": 350000,
  "finalBalance": 150000,
  "isAffordable": true,
  "availableBudget": 55333.33,
  "projection": [
    {
      "month": 0,
      "balance": 350000,
      "target": 150000,
      "income": 150000,
      "expenses": 110667
    },
    {
      "month": 1,
      "balance": 333333,
      "target": 150000,
      "income": 150000,
      "expenses": 110667
    }
  ]
}
```

### GET /planner/scenarios
Получить сохраненные сценарии
```json
Response:
{
  "scenarios": [
    {
      "id": "scenario_1",
      "type": "vacation",
      "name": "Отпуск",
      "amount": 200000,
      "months": 12,
      "targetDate": "2025-11-02",
      "isAffordable": true,
      "createdAt": "2024-11-02T14:30:00Z"
    }
  ]
}
```

### POST /planner/scenarios
Сохранить новый сценарий
```json
Request:
{
  "type": "vacation",
  "name": "Отпуск в Таиланд",
  "amount": 200000,
  "months": 12,
  "targetDate": "2025-11-02"
}

Response:
{
  "id": "scenario_2",
  "type": "vacation",
  "name": "Отпуск в Таиланд",
  "amount": 200000,
  "months": 12,
  "targetDate": "2025-11-02",
  "createdAt": "2024-11-02T14:30:00Z"
}
```

### PUT /planner/scenarios/:id
Обновить сценарий
```json
Request:
{
  "amount": 250000,
  "months": 10
}

Response:
{
  "id": "scenario_1",
  "type": "vacation",
  "amount": 250000,
  "months": 10,
  "updatedAt": "2024-11-02T14:30:00Z"
}
```

### DELETE /planner/scenarios/:id
Удалить сценарий
```json
Response:
{
  "message": "Scenario successfully deleted"
}
```

---

## 9. Notifications (Уведомления)

### GET /notifications
Получить список уведомлений
```json
Query Parameters:
- page: number
- limit: number
- read: boolean (optional)

Response:
{
  "notifications": [
    {
      "id": "notif_1",
      "type": "alert",
      "title": "Превышение бюджета",
      "message": "Вы потратили больше, чем запланировано в категории 'Продукты'",
      "isRead": false,
      "createdAt": "2024-11-02T14:30:00Z"
    }
  ],
  "total": 25,
  "unreadCount": 5
}
```

### PUT /notifications/:id/read
Пометить уведомление как прочитанное
```json
Response:
{
  "id": "notif_1",
  "isRead": true
}
```

### PUT /notifications/mark-all-read
Пометить все уведомления как прочитанные
```json
Response:
{
  "message": "All notifications marked as read"
}
```

### DELETE /notifications/:id
Удалить уведомление
```json
Response:
{
  "message": "Notification successfully deleted"
}
```

---

## 10. Settings (Настройки уведомлений)

### GET /settings/notifications
Получить настройки уведомлений
```json
Response:
{
  "emailNotifications": true,
  "pushNotifications": true,
  "aiRecommendations": true,
  "weeklyReports": false,
  "budgetAlerts": true,
  "transactionAlerts": true
}
```

### PUT /settings/notifications
Обновить настройки уведомлений
```json
Request:
{
  "emailNotifications": true,
  "pushNotifications": true,
  "aiRecommendations": true,
  "weeklyReports": true,
  "budgetAlerts": true,
  "transactionAlerts": true
}

Response:
{
  "emailNotifications": true,
  "pushNotifications": true,
  "aiRecommendations": true,
  "weeklyReports": true,
  "budgetAlerts": true,
  "transactionAlerts": true,
  "message": "Settings successfully updated"
}
```

---

## 11. AI Insights (AI Рекомендации)

### GET /ai/insights
Получить AI рекомендации
```json
Response:
{
  "insights": [
    {
      "id": "insight_1",
      "title": "Оптимизация расходов на продукты",
      "description": "Вы можете сэкономить 2000₽ в месяц, если будете покупать продукты в Лента вместо Пятёрочки",
      "savingsPotential": 2000,
      "priority": "high",
      "category": "spending"
    },
    {
      "id": "insight_2",
      "title": "Автоматизация платежей",
      "description": "Вы можете настроить автоматические платежи для подписок и сэкономить время",
      "category": "automation"
    }
  ]
}
```

### POST /ai/chat
Отправить сообщение AI ассистенту
```json
Request:
{
  "message": "Как я могу сэкономить больше денег?"
}

Response:
{
  "response": "На основе анализа ваших расходов я вижу, что вы потратили в среднем 25,000₽ на продукты. Я рекомендую...",
  "suggestions": [
    {
      "title": "Перейти в бюджетный магазин",
      "savingsPotential": 2000
    }
  ]
}
```

---

## 12. Reports (Отчеты)

### GET /reports/export
Экспортировать отчет в PDF
```json
Query Parameters:
- format: "pdf" | "excel"
- period: "month" | "year"
- startDate: ISO 8601 date
- endDate: ISO 8601 date

Response: File (Binary)
```

### POST /reports/email
Отправить отчет на email
```json
Request:
{
  "period": "month",
  "format": "pdf",
  "startDate": "2024-11-01",
  "endDate": "2024-11-30"
}

Response:
{
  "message": "Report sent to your email successfully"
}
```

---

## Error Response Format

Все ошибки возвращаются в следующем формате:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional information"
  },
  "status": 400
}
```

### Common HTTP Status Codes:
- `200`: OK
- `201`: Created
- `204`: No Content
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Unprocessable Entity
- `500`: Internal Server Error

---

## Authentication Header

Все защищенные endpoints требуют:

```
Authorization: Bearer <jwt_token>
```

---

## Rate Limiting

- Limit: 1000 requests per hour
- Requests header: `X-RateLimit-Limit: 1000`
- Remaining header: `X-RateLimit-Remaining: 999`
- Reset header: `X-RateLimit-Reset: 1730549400`

---

## Webhook Events

Приложение поддерживает следующие webhook события:

```
- transaction.created
- transaction.completed
- transaction.failed
- budget.exceeded
- investment.alert
- account.connected
- account.disconnected
```

Для подписки на события используйте: `POST /webhooks/subscribe`

