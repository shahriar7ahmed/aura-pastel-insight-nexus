import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Focus, BookOpen, Target, TrendingUp, Sparkles } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { memo, useMemo } from "react";

// Memoized suggestion card component
const SuggestionCard = memo(({ icon: Icon, title, color }: {
  icon: typeof Focus;
  title: string;
  color: string;
}) => (
  <Card className="glass-card hover-lift border-0 cursor-pointer group">
    <CardContent className="p-6 flex items-center gap-4">
      <div className={`p-3 rounded-full bg-muted/50 group-hover:scale-110 transition-transform ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium">{title}</p>
    </CardContent>
  </Card>
));

SuggestionCard.displayName = "SuggestionCard";

// Memoized decorative mood visualization
const MoodVisualization = memo(() => (
  <div className="relative w-48 h-48 animate-float">
    <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-60 rounded-full blur-2xl" />
    <div className="absolute inset-4 bg-gradient-to-tr from-accent via-primary to-secondary opacity-80 rounded-full blur-xl" />
    <div className="absolute inset-8 bg-gradient-to-bl from-secondary via-accent to-primary opacity-90 rounded-full blur-lg" />
  </div>
));

MoodVisualization.displayName = "MoodVisualization";

// Extracted constants
const FOCUS_DATA = [
  { value: 2.5 },
  { value: 3.2 },
  { value: 2.8 },
  { value: 4.1 },
  { value: 3.5 },
  { value: 3.8 },
  { value: 4.2 },
];

const SUGGESTIONS = [
  {
    icon: Target,
    title: "Try the 'Mindful Morning' Challenge",
    color: "text-primary",
  },
  {
    icon: BookOpen,
    title: "What's on your mind?",
    color: "text-secondary",
  },
  {
    icon: TrendingUp,
    title: "Explore your latest insights",
    color: "text-accent",
  },
] as const;

const Dashboard = () => {
  const userName = "Alex";
  const currentMood = "Calm";
  const focusGoal = "deep work";

  // Memoize greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        {/* Main Hero Card */}
        <Card className="glass-card hover-lift border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse-glow" />
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold">
                  {greeting}, {userName}!
                </h1>
                <div className="space-y-1 text-muted-foreground">
                  <p className="text-lg">Current Mood: <span className="text-foreground font-medium">{currentMood}</span></p>
                  <p className="text-lg">Focus Goal Today: <span className="text-foreground font-medium">{focusGoal}</span></p>
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 shadow-soft" asChild>
                    <Link to="/focus">
                      <Focus className="w-4 h-4 mr-2" />
                      Start Focus Session
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full glass-card border-primary/20 hover:bg-primary/5" asChild>
                    <Link to="/journal">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Quick Journal Entry
                    </Link>
                  </Button>
                </div>
              </div>
              
              <MoodVisualization />
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Focus Summary */}
          <Card className="glass-card hover-lift border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Focus className="w-5 h-5 text-primary" />
                Focus Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last 7 Days:</p>
                <p className="text-2xl font-bold">12h 45m Focused Work</p>
              </div>
              
              <ResponsiveContainer width="100%" height={80}>
                <LineChart data={FOCUS_DATA}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <p className="text-sm text-muted-foreground">
                You're <span className="text-primary font-semibold">15%</span> more focused than last week!
              </p>
            </CardContent>
          </Card>

          {/* Mood Summary */}
          <Card className="glass-card hover-lift border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Mood Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Recent Moods:</p>
                <p className="text-2xl font-bold">Calm, Productive</p>
              </div>
              
              <div className="relative w-full h-24 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40 blur-xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/60 via-secondary/60 to-accent/60 rounded-full blur-lg" />
                  <div className="absolute w-12 h-12 bg-gradient-to-tr from-accent/70 via-primary/70 to-secondary/70 rounded-full blur-md" />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Your latest journal entry generated a particle-based piece
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions Carousel */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Suggestions for You</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {SUGGESTIONS.map((suggestion, index) => (
              <SuggestionCard key={index} {...suggestion} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
