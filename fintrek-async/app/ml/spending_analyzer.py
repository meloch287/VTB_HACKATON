"""
Анализатор паттернов расходов пользователя
"""
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
import logging

from app.models.transaction import Transaction, TransactionType
from app.models.category import Category

logger = logging.getLogger(__name__)


class SpendingAnalyzer:
    """Анализ паттернов расходов и выявление аномалий"""
    
    def get_spending_by_category(
        self,
        db: Session,
        user_id: str,
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, float]:
        """
        Получить расходы по категориям за период
        
        Args:
            db: Database session
            user_id: ID пользователя
            start_date: Начальная дата
            end_date: Конечная дата
            
        Returns:
            Словарь {название_категории: сумма}
        """
        results = db.query(
            Category.name,
            func.sum(Transaction.amount).label('total')
        ).join(
            Transaction, Transaction.category_id == Category.id
        ).filter(
            and_(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date <= end_date
            )
        ).group_by(Category.name).all()
        
        return {name: float(total) for name, total in results}
    
    def get_monthly_spending(
        self,
        db: Session,
        user_id: str,
        months: int = 6
    ) -> List[Dict]:
        """
        Получить расходы по месяцам
        
        Args:
            db: Database session
            user_id: ID пользователя
            months: Количество месяцев для анализа
            
        Returns:
            Список словарей с данными по месяцам
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=months * 30)
        
        results = db.query(
            func.date_trunc('month', Transaction.transaction_date).label('month'),
            func.sum(Transaction.amount).label('total')
        ).filter(
            and_(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date <= end_date
            )
        ).group_by('month').order_by('month').all()
        
        return [
            {
                'month': month.strftime('%Y-%m'),
                'total': float(total)
            }
            for month, total in results
        ]
    
    def detect_recurring_payments(
        self,
        db: Session,
        user_id: str,
        min_occurrences: int = 3
    ) -> List[Dict]:
        """
        Выявить повторяющиеся платежи (подписки)
        
        Args:
            db: Database session
            user_id: ID пользователя
            min_occurrences: Минимальное количество повторений
            
        Returns:
            Список повторяющихся платежей
        """
        # Получить транзакции за последние 6 месяцев
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=180)
        
        transactions = db.query(Transaction).filter(
            and_(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date <= end_date
            )
        ).all()
        
        # Группировать по продавцу и сумме
        payment_groups = {}
        
        for txn in transactions:
            if not txn.merchant_name:
                continue
            
            key = (txn.merchant_name, float(txn.amount))
            
            if key not in payment_groups:
                payment_groups[key] = []
            
            payment_groups[key].append(txn.transaction_date)
        
        # Найти повторяющиеся платежи
        recurring = []
        
        for (merchant, amount), dates in payment_groups.items():
            if len(dates) >= min_occurrences:
                # Вычислить средний интервал между платежами
                if len(dates) > 1:
                    sorted_dates = sorted(dates)
                    intervals = [
                        (sorted_dates[i+1] - sorted_dates[i]).days
                        for i in range(len(sorted_dates) - 1)
                    ]
                    avg_interval = sum(intervals) / len(intervals)
                    
                    recurring.append({
                        'merchant': merchant,
                        'amount': amount,
                        'occurrences': len(dates),
                        'avg_interval_days': round(avg_interval, 1),
                        'last_payment': max(dates).isoformat(),
                        'next_expected': (max(dates) + timedelta(days=avg_interval)).isoformat()
                    })
        
        return sorted(recurring, key=lambda x: x['amount'], reverse=True)
    
    def detect_anomalies(
        self,
        db: Session,
        user_id: str,
        threshold_multiplier: float = 2.0
    ) -> List[Dict]:
        """
        Выявить аномальные транзакции (необычно большие расходы)
        
        Args:
            db: Database session
            user_id: ID пользователя
            threshold_multiplier: Множитель для определения аномалии
            
        Returns:
            Список аномальных транзакций
        """
        # Получить статистику по категориям за последние 3 месяца
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=90)
        
        # Вычислить среднюю и максимальную сумму по каждой категории
        category_stats = db.query(
            Transaction.category_id,
            func.avg(Transaction.amount).label('avg_amount'),
            func.stddev(Transaction.amount).label('stddev_amount')
        ).filter(
            and_(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date <= end_date
            )
        ).group_by(Transaction.category_id).all()
        
        # Создать словарь статистики
        stats_dict = {
            cat_id: {'avg': float(avg), 'stddev': float(stddev) if stddev else 0}
            for cat_id, avg, stddev in category_stats
        }
        
        # Найти аномальные транзакции за последний месяц
        recent_start = end_date - timedelta(days=30)
        
        recent_transactions = db.query(Transaction).filter(
            and_(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                Transaction.transaction_date >= recent_start,
                Transaction.transaction_date <= end_date
            )
        ).all()
        
        anomalies = []
        
        for txn in recent_transactions:
            if not txn.category_id or txn.category_id not in stats_dict:
                continue
            
            stats = stats_dict[txn.category_id]
            threshold = stats['avg'] + (stats['stddev'] * threshold_multiplier)
            
            if float(txn.amount) > threshold:
                category = db.query(Category).filter(
                    Category.id == txn.category_id
                ).first()
                
                anomalies.append({
                    'transaction_id': str(txn.id),
                    'date': txn.transaction_date.isoformat(),
                    'amount': float(txn.amount),
                    'category': category.name if category else 'Unknown',
                    'merchant': txn.merchant_name,
                    'description': txn.description,
                    'expected_max': round(threshold, 2),
                    'deviation': round(float(txn.amount) - threshold, 2)
                })
        
        return sorted(anomalies, key=lambda x: x['deviation'], reverse=True)
    
    def get_spending_trends(
        self,
        db: Session,
        user_id: str
    ) -> Dict:
        """
        Получить тренды расходов
        
        Args:
            db: Database session
            user_id: ID пользователя
            
        Returns:
            Словарь с трендами
        """
        # Сравнить текущий месяц с предыдущим
        now = datetime.utcnow()
        current_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        prev_month_start = (current_month_start - timedelta(days=1)).replace(day=1)
        
        # Расходы текущего месяца
        current_spending = db.query(
            func.sum(Transaction.amount)
        ).filter(
            and_(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                Transaction.transaction_date >= current_month_start
            )
        ).scalar() or Decimal(0)
        
        # Расходы предыдущего месяца
        prev_spending = db.query(
            func.sum(Transaction.amount)
        ).filter(
            and_(
                Transaction.user_id == user_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                Transaction.transaction_date >= prev_month_start,
                Transaction.transaction_date < current_month_start
            )
        ).scalar() or Decimal(0)
        
        # Вычислить изменение
        if prev_spending > 0:
            change_percent = ((current_spending - prev_spending) / prev_spending) * 100
        else:
            change_percent = 0
        
        return {
            'current_month': float(current_spending),
            'previous_month': float(prev_spending),
            'change_percent': round(float(change_percent), 2),
            'trend': 'up' if change_percent > 5 else 'down' if change_percent < -5 else 'stable'
        }


# Singleton instance
spending_analyzer = SpendingAnalyzer()
