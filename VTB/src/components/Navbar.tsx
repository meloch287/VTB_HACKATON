import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart3, Calculator, TrendingUp, Crown, User, Menu, ArrowLeftRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const navigation = [
  { name: "Главная", href: "/", icon: LayoutDashboard },
  { name: "Переводы", href: "/transfers", icon: ArrowLeftRight },
  { name: "Аналитика", href: "/analytics", icon: BarChart3 },
  { name: "Планировщик", href: "/planner", icon: Calculator },
  { name: "Инвестиции", href: "/investments", icon: TrendingUp },
  { name: "Тарифы", href: "/pricing", icon: Crown },
  { name: "Профиль", href: "/profile", icon: User },
];

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="gradient-accent w-10 h-10 rounded-xl flex items-center justify-center text-accent-foreground font-bold text-xl">
              F
            </div>
            <span className="font-bold text-xl gradient-primary bg-clip-text text-transparent">
              Финтрек
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`gap-2 ${isActive ? "bg-accent/10 text-accent" : ""}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};
