import { Link, useLocation } from "react-router-dom";
import { Waves, Focus, BookOpen, Target, TrendingUp, Settings, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Waves },
    { path: "/focus", label: "Focus", icon: Focus },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/challenges", label: "Challenges", icon: Target },
    { path: "/insights", label: "Insights", icon: TrendingUp },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
      <div className="glass-card rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary font-semibold text-lg">
          <Waves className="w-6 h-6" />
          <span>Aura</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Button>
          <Avatar className="w-9 h-9 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary">A</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
