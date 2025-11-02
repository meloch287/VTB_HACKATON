import { FinancialPulse } from "@/components/FinancialPulse";
import { AIInsightPanel } from "@/components/AIInsightPanel";
import { Card } from "@/components/ui/card";
import { Wallet, TrendingUp, CreditCard, PiggyBank } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const accountData = [
  { name: "Основной", amount: 125000, icon: Wallet, color: "hsl(175 100% 39%)" },
  { name: "Сбережения", amount: 350000, icon: PiggyBank, color: "hsl(215 76% 16%)" },
  { name: "Инвестиции", amount: 580000, icon: TrendingUp, color: "hsl(175 80% 50%)" },
  { name: "Кредитная", amount: -15000, icon: CreditCard, color: "hsl(0 84% 60%)" },
];

const incomeExpenseData = [
  { month: "Янв", income: 120000, expenses: 85000 },
  { month: "Фев", income: 130000, expenses: 92000 },
  { month: "Мар", income: 125000, expenses: 88000 },
  { month: "Апр", income: 140000, expenses: 95000 },
  { month: "Май", income: 135000, expenses: 90000 },
  { month: "Июн", income: 150000, expenses: 98000 },
];

const categoryData = [
  { name: "Продукты", value: 25000, color: "hsl(175 100% 39%)" },
  { name: "Транспорт", value: 15000, color: "hsl(215 76% 16%)" },
  { name: "Развлечения", value: 18000, color: "hsl(175 80% 50%)" },
  { name: "Подписки", value: 8000, color: "hsl(215 60% 25%)" },
  { name: "Прочее", value: 12000, color: "hsl(215 20% 93%)" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Добро пожаловать!</h1>
          <p className="text-muted-foreground">Вот обзор ваших финансов</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Financial Pulse */}
          <div className="lg:col-span-1">
            <FinancialPulse score={78} trend="up" change={5} />
          </div>

          {/* Accounts Summary */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {accountData.map((account, index) => (
              <Card
                key={index}
                className="p-6 card-neo hover:shadow-lg transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <account.icon className="w-8 h-8" style={{ color: account.color }} />
                  <span className="text-sm text-muted-foreground">{account.name}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: account.color }}>
                  {account.amount >= 0 ? "₽" : "-₽"}
                  {Math.abs(account.amount).toLocaleString()}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Income vs Expenses */}
          <Card className="p-6 card-neo">
            <h3 className="text-xl font-semibold mb-4">Доходы и расходы</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={incomeExpenseData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(175 100% 39%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(175 100% 39%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(215 76% 16%)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(215 76% 16%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="hsl(175 100% 39%)"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  name="Доходы"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(215 76% 16%)"
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  name="Расходы"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-6 card-neo">
            <h3 className="text-xl font-semibold mb-4">Расходы по категориям</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Monthly Comparison */}
        <Card className="p-6 card-neo">
          <h3 className="text-xl font-semibold mb-4">Сравнение по месяцам</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeExpenseData}>
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
              <Bar dataKey="income" fill="hsl(175 100% 39%)" name="Доходы" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="hsl(215 76% 16%)" name="Расходы" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <AIInsightPanel />
    </div>
  );
}
