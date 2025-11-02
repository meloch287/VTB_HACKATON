import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const monthlyData = [
  { month: "Янв", Продукты: 25000, Транспорт: 15000, Развлечения: 18000, Подписки: 8000, Прочее: 12000 },
  { month: "Фев", Продукты: 27000, Транспорт: 16000, Развлечения: 20000, Подписки: 8000, Прочее: 11000 },
  { month: "Мар", Продукты: 24000, Транспорт: 14000, Развлечения: 17000, Подписки: 9000, Прочее: 13000 },
  { month: "Апр", Продукты: 26000, Транспорт: 15000, Развлечения: 19000, Подписки: 8500, Прочее: 12000 },
  { month: "Май", Продукты: 28000, Транспорт: 17000, Развлечения: 21000, Подписки: 9500, Прочее: 14000 },
  { month: "Июн", Продукты: 29000, Транспорт: 18000, Развлечения: 22000, Подписки: 10000, Прочее: 15000 },
];

const trendData = [
  { month: "Янв", value: 78000 },
  { month: "Фев", value: 82000 },
  { month: "Мар", value: 77000 },
  { month: "Апр", value: 80500 },
  { month: "Май", value: 89500 },
  { month: "Июн", value: 94000 },
];

const transactions = [
  { date: "2024-06-15", category: "Продукты", merchant: "Пятёрочка", amount: -2500, type: "expense" },
  { date: "2024-06-14", category: "Транспорт", merchant: "Яндекс.Такси", amount: -450, type: "expense" },
  { date: "2024-06-14", category: "Зарплата", merchant: "ООО Компания", amount: 150000, type: "income" },
  { date: "2024-06-13", category: "Развлечения", merchant: "Кинотеатр", amount: -1200, type: "expense" },
  { date: "2024-06-12", category: "Подписки", merchant: "Netflix", amount: -990, type: "expense" },
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Аналитика бюджета</h1>
            <p className="text-muted-foreground">Детальный анализ ваших финансов</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Фильтры
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Период
            </Button>
            <Button variant="accent" className="gap-2">
              <Download className="w-4 h-4" />
              Экспорт
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 card-neo">
            <p className="text-sm text-muted-foreground mb-2">Общие расходы</p>
            <p className="text-3xl font-bold text-primary">₽94,000</p>
            <p className="text-sm text-accent mt-1">+12% к прошлому месяцу</p>
          </Card>
          <Card className="p-6 card-neo">
            <p className="text-sm text-muted-foreground mb-2">Средний чек</p>
            <p className="text-3xl font-bold text-primary">₽1,567</p>
            <p className="text-sm text-muted-foreground mt-1">За июнь 2024</p>
          </Card>
          <Card className="p-6 card-neo">
            <p className="text-sm text-muted-foreground mb-2">Топ категория</p>
            <p className="text-3xl font-bold text-accent">Продукты</p>
            <p className="text-sm text-muted-foreground mt-1">₽29,000 (31%)</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 card-neo">
            <h3 className="text-xl font-semibold mb-4">Расходы по категориям</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Bar dataKey="Продукты" stackId="a" fill="hsl(175 100% 39%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Транспорт" stackId="a" fill="hsl(215 76% 16%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Развлечения" stackId="a" fill="hsl(175 80% 50%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Подписки" stackId="a" fill="hsl(215 60% 25%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Прочее" stackId="a" fill="hsl(215 20% 93%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 card-neo">
            <h3 className="text-xl font-semibold mb-4">Тренд расходов</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(175 100% 39%)"
                  strokeWidth={3}
                  dot={{ fill: "hsl(175 100% 39%)", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="p-6 card-neo">
          <h3 className="text-xl font-semibold mb-4">Последние транзакции</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Дата</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Категория</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Получатель</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/50 transition-smooth">
                    <td className="py-3 px-4 text-sm">{transaction.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{transaction.merchant}</td>
                    <td className={`py-3 px-4 text-sm text-right font-semibold ${
                      transaction.type === "income" ? "text-accent" : "text-foreground"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}₽{transaction.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
