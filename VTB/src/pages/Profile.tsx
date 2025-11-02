import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, CreditCard, Download, LogOut } from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <User className="w-10 h-10 text-accent" />
            Профиль
          </h1>
          <p className="text-muted-foreground">Управление аккаунтом и настройками</p>
        </div>

        {/* Profile Information */}
        <Card className="p-6 card-neo mb-6">
          <h3 className="text-xl font-semibold mb-6">Личная информация</h3>
          
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 rounded-full gradient-accent flex items-center justify-center text-3xl font-bold text-accent-foreground">
              АИ
            </div>
            <div>
              <Button variant="outline" size="sm">Изменить фото</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">Имя</Label>
              <Input id="firstName" defaultValue="Александр" className="mt-2" />
            </div>
            <div>
              <Label htmlFor="lastName">Фамилия</Label>
              <Input id="lastName" defaultValue="Иванов" className="mt-2" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="alexandr@example.com" className="mt-2" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" type="tel" defaultValue="+7 (999) 123-45-67" className="mt-2" />
            </div>
          </div>

          <Button variant="accent" className="mt-6">Сохранить изменения</Button>
        </Card>

        {/* Notifications */}
        <Card className="p-6 card-neo mb-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Уведомления
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email уведомления</p>
                <p className="text-sm text-muted-foreground">Получать отчёты и советы на email</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push уведомления</p>
                <p className="text-sm text-muted-foreground">Важные события и превышения бюджета</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">AI рекомендации</p>
                <p className="text-sm text-muted-foreground">Умные советы по оптимизации финансов</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Недельные отчёты</p>
                <p className="text-sm text-muted-foreground">Сводка по расходам каждую неделю</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Connected Banks */}
        <Card className="p-6 card-neo mb-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            Подключённые банки
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                  ВТБ
                </div>
                <div>
                  <p className="font-semibold">ВТБ Банк</p>
                  <p className="text-sm text-muted-foreground">•••• 4567</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Отключить</Button>
            </div>

            <Button variant="outline" className="w-full">
              + Добавить банк через VTB Open API
            </Button>
          </div>
        </Card>

        {/* Export & Settings */}
        <Card className="p-6 card-neo mb-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Download className="w-5 h-5 text-accent" />
            Экспорт данных
          </h3>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download className="w-4 h-4" />
              Скачать отчёт в PDF
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download className="w-4 h-4" />
              Экспортировать в Excel
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-2 border-destructive/20 bg-destructive/5">
          <h3 className="text-xl font-semibold mb-4 text-destructive">Опасная зона</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2 text-destructive border-destructive/50 hover:bg-destructive/10">
              <LogOut className="w-4 h-4" />
              Выйти из аккаунта
            </Button>
            <Button variant="destructive" className="w-full">
              Удалить аккаунт
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
