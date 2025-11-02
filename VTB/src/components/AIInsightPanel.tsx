import { Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import iconAI from "@/assets/icon-ai.png";

interface Insight {
  id: string;
  type: "tip" | "warning" | "opportunity";
  title: string;
  description: string;
}

const mockInsights: Insight[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Возможность сэкономить",
    description: "Вы потратили на 15% больше на подписки в этом месяце. Рекомендуем пересмотреть неиспользуемые сервисы.",
  },
  {
    id: "2",
    type: "tip",
    title: "Инвестиционный совет",
    description: "На основе вашего профиля риска рекомендуем диверсифицировать портфель добавлением облигаций.",
  },
  {
    id: "3",
    type: "warning",
    title: "Превышение лимита",
    description: "Расходы на развлечения близки к установленному лимиту. Осталось ₽3,500.",
  },
];

export const AIInsightPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [insights] = useState(mockInsights);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="accent"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
      >
        <Sparkles className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-h-[600px] card-neo p-6 z-50 animate-slide-up overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img src={iconAI} alt="AI" className="w-8 h-8" />
          <h3 className="font-semibold text-lg">AI Советник</h3>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-xl border-2 transition-smooth hover:shadow-md ${
              insight.type === "opportunity"
                ? "border-accent/30 bg-accent/5"
                : insight.type === "warning"
                ? "border-destructive/30 bg-destructive/5"
                : "border-primary/30 bg-primary/5"
            }`}
          >
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              {insight.title}
            </h4>
            <p className="text-xs text-muted-foreground">{insight.description}</p>
          </div>
        ))}
      </div>

      <Button variant="accent" className="w-full mt-4">
        Получить подробный анализ
      </Button>
    </div>
  );
};
