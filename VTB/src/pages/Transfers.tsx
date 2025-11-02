import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, Download, Filter, Repeat, Search, Send } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data
const accountOptions = [
  { id: 1, name: "Основной счет", balance: 125000, bank: "ВТБ" },
  { id: 2, name: "Сбережения", balance: 350000, bank: "Сбербанк" },
  { id: 3, name: "Инвестиционный", balance: 580000, bank: "Тинькофф" },
];

const recentTransactions = [
  { id: 1, date: "2025-10-28", type: "outgoing", recipient: "Иван Петров", amount: 5000, category: "Перевод другу", status: "completed", bank: "ВТБ" },
  { id: 2, date: "2025-10-27", type: "incoming", recipient: "Зарплата", amount: 120000, category: "Доход", status: "completed", bank: "ВТБ" },
  { id: 3, date: "2025-10-26", type: "outgoing", recipient: "Пятерочка", amount: 2500, category: "Продукты", status: "completed", bank: "Сбербанк" },
  { id: 4, date: "2025-10-25", type: "outgoing", recipient: "Netflix", amount: 999, category: "Подписки", status: "completed", bank: "Тинькофф" },
  { id: 5, date: "2025-10-24", type: "outgoing", recipient: "Мария Сидорова", amount: 15000, category: "Перевод", status: "pending", bank: "ВТБ" },
  { id: 6, date: "2025-10-23", type: "outgoing", recipient: "Яндекс Такси", amount: 450, category: "Транспорт", status: "completed", bank: "Сбербанк" },
  { id: 7, date: "2025-10-22", type: "incoming", recipient: "Возврат налога", amount: 13500, category: "Доход", status: "completed", bank: "ВТБ" },
  { id: 8, date: "2025-10-21", type: "outgoing", recipient: "Лента", amount: 3200, category: "Продукты", status: "completed", bank: "Сбербанк" },
];

const savedTemplates = [
  { id: 1, name: "Аренда квартиры", recipient: "Агентство Недвижимости", amount: 50000 },
  { id: 2, name: "Мама", recipient: "Анна Иванова", amount: 20000 },
  { id: 3, name: "Коммунальные", recipient: "ЖКХ Сервис", amount: 8000 },
];

const transferAnalytics = [
  { name: "Переводы друзьям", value: 45000, count: 12 },
  { name: "Платежи ЖКХ", value: 24000, count: 3 },
  { name: "Подписки", value: 5000, count: 8 },
  { name: "Прочее", value: 15000, count: 7 },
];

const monthlyActivity = [
  { month: "Янв", outgoing: 85000, incoming: 120000 },
  { month: "Фев", outgoing: 92000, incoming: 130000 },
  { month: "Мар", outgoing: 88000, incoming: 125000 },
  { month: "Апр", outgoing: 95000, incoming: 140000 },
  { month: "Май", outgoing: 90000, incoming: 135000 },
  { month: "Июн", outgoing: 98000, incoming: 150000 },
];

const COLORS = ["hsl(175 100% 39%)", "hsl(215 76% 16%)", "hsl(175 80% 50%)", "hsl(215 60% 25%)"];

export default function Transfers() {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBank, setFilterBank] = useState("all");

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transfer:", { selectedAccount, recipient, amount, comment });
    // Mock success
    alert("Перевод успешно отправлен!");
    setRecipient("");
    setAmount("");
    setComment("");
  };

  const filteredTransactions = recentTransactions.filter((tx) => {
    const matchesSearch = 
      tx.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || tx.category === filterCategory;
    const matchesBank = filterBank === "all" || tx.bank === filterBank;
    return matchesSearch && matchesCategory && matchesBank;
  });

  return (
    <div className="min-h-screen bg-background py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Переводы</h1>
          <p className="text-muted-foreground">Управляйте переводами и отслеживайте историю операций</p>
        </div>

        <Tabs defaultValue="transfer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="transfer">Перевод</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          {/* Transfer Tab */}
          <TabsContent value="transfer" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Transfer Form */}
              <Card className="p-4 md:p-6 card-neo lg:col-span-2">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-accent" />
                  Новый перевод
                </h3>
                <form onSubmit={handleTransfer} className="space-y-4">
                  <div>
                    <Label htmlFor="account">Счет списания</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger id="account">
                        <SelectValue placeholder="Выберите счет" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountOptions.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id.toString()}>
                            {acc.name} • {acc.bank} • ₽{acc.balance.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="recipient">Получатель</Label>
                    <Input
                      id="recipient"
                      placeholder="Номер карты, телефона или счета"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">Сумма</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="comment">Комментарий (необязательно)</Label>
                    <Input
                      id="comment"
                      placeholder="Назначение платежа"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" variant="accent">
                    <Send className="w-4 h-4 mr-2" />
                    Отправить перевод
                  </Button>
                </form>
              </Card>

              {/* Saved Templates */}
              <Card className="p-4 md:p-6 card-neo">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-accent" />
                  Шаблоны
                </h3>
                <div className="space-y-3">
                  {savedTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-3 rounded-lg border border-border hover:bg-secondary/50 transition-smooth cursor-pointer"
                      onClick={() => {
                        setRecipient(template.recipient);
                        setAmount(template.amount.toString());
                      }}
                    >
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {template.recipient} • ₽{template.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-4 md:p-6 card-neo">
              <h3 className="text-xl font-semibold mb-4">Последние операции</h3>
              <div className="space-y-3">
                {recentTransactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-smooth">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === "incoming" ? "bg-accent/10" : "bg-muted"
                      }`}>
                        {tx.type === "incoming" ? (
                          <ArrowDownLeft className="w-5 h-5 text-accent" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{tx.recipient}</div>
                        <div className="text-xs text-muted-foreground">{tx.category} • {tx.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${tx.type === "incoming" ? "text-accent" : ""}`}>
                        {tx.type === "incoming" ? "+" : "-"}₽{tx.amount.toLocaleString()}
                      </div>
                      <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {tx.status === "completed" ? "Выполнен" : "В ожидании"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            {/* Filters */}
            <Card className="p-4 md:p-6 card-neo">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="sr-only">Поиск</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Поиск по операциям..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Категория" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все категории</SelectItem>
                      <SelectItem value="Перевод">Переводы</SelectItem>
                      <SelectItem value="Продукты">Продукты</SelectItem>
                      <SelectItem value="Транспорт">Транспорт</SelectItem>
                      <SelectItem value="Подписки">Подписки</SelectItem>
                      <SelectItem value="Доход">Доходы</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterBank} onValueChange={setFilterBank}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Банк" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все банки</SelectItem>
                      <SelectItem value="ВТБ">ВТБ</SelectItem>
                      <SelectItem value="Сбербанк">Сбербанк</SelectItem>
                      <SelectItem value="Тинькофф">Тинькофф</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Transactions Table */}
            <Card className="p-4 md:p-6 card-neo overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Получатель / Отправитель</TableHead>
                      <TableHead>Категория</TableHead>
                      <TableHead>Банк</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="whitespace-nowrap">{tx.date}</TableCell>
                        <TableCell>
                          {tx.type === "incoming" ? (
                            <ArrowDownLeft className="w-4 h-4 text-accent" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{tx.recipient}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{tx.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{tx.bank}</TableCell>
                        <TableCell className={`text-right font-semibold whitespace-nowrap ${
                          tx.type === "incoming" ? "text-accent" : ""
                        }`}>
                          {tx.type === "incoming" ? "+" : "-"}₽{tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                            {tx.status === "completed" ? "Выполнен" : "В ожидании"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Transfer Structure */}
              <Card className="p-4 md:p-6 card-neo">
                <h3 className="text-xl font-semibold mb-4">Структура переводов</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={transferAnalytics}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ₽${value.toLocaleString()}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {transferAnalytics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

              {/* Monthly Activity */}
              <Card className="p-4 md:p-6 card-neo">
                <h3 className="text-xl font-semibold mb-4">Активность по месяцам</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyActivity}>
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
                    <Bar dataKey="incoming" fill="hsl(175 100% 39%)" name="Входящие" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="outgoing" fill="hsl(215 76% 16%)" name="Исходящие" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Stats Summary */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {transferAnalytics.map((item, index) => (
                <Card key={index} className="p-4 md:p-6 card-neo">
                  <div className="text-sm text-muted-foreground mb-2">{item.name}</div>
                  <div className="text-2xl font-bold mb-1" style={{ color: COLORS[index] }}>
                    ₽{item.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.count} операций</div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
