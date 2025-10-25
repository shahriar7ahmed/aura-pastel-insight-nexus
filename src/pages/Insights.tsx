import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Heart, Smartphone, Sparkles, Award } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useMemo } from "react";

// Constants
const CHART_COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted-foreground))",
} as const;

const AURA_SCORE_THRESHOLDS = {
  excellent: 80,
  good: 60,
  fair: 40,
} as const;

// Types
interface FocusTrendData {
  day: string;
  hours: number;
}

interface HabitData {
  name: string;
  value: number;
  color: string;
}

interface DistractorData {
  site: string;
  time: number;
}

// Helper functions
const getAuraScoreLabel = (score: number): string => {
  if (score >= AURA_SCORE_THRESHOLDS.excellent) return "excellent";
  if (score >= AURA_SCORE_THRESHOLDS.good) return "good";
  if (score >= AURA_SCORE_THRESHOLDS.fair) return "fair";
  return "needs improvement";
};

const getTotalHours = (data: FocusTrendData[]): number => {
  return data.reduce((sum, item) => sum + item.hours, 0);
};

// Subcomponents
const AuraScoreDisplay = ({ score }: { score: number }) => {
  const scoreLabel = useMemo(() => getAuraScoreLabel(score), [score]);

  return (
    <div className="relative">
      <div className="w-48 h-48 rounded-full glass-card flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="text-6xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse-slow">
            {score}
          </div>
          <div className="text-sm text-muted-foreground mt-1">out of 100</div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-2xl -z-10 animate-pulse-glow" />
    </div>
  );
};

const StatIndicator = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 rounded-full ${color} shadow-sm`} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-3 border border-border rounded-lg shadow-xl">
      <p className="text-sm font-semibold">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">
        {payload[0].value} {payload[0].dataKey === "hours" ? "hours" : "min"}
      </p>
    </div>
  );
};

const MoodTag = ({ mood, index }: { mood: string; index: number }) => (
  <div
    className="px-4 py-2 rounded-full glass-card text-sm font-medium hover-lift cursor-pointer transition-all hover:scale-105"
    style={{ 
      fontSize: `${Math.max(0.7, 1 - index * 0.08)}rem`,
      opacity: 1 - index * 0.1 
    }}
  >
    #{mood}
  </div>
);

const Insights = () => {
  const auraScore = 85;

  const focusTrendData: FocusTrendData[] = useMemo(() => [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 4.2 },
    { day: "Wed", hours: 3.8 },
    { day: "Thu", hours: 5.1 },
    { day: "Fri", hours: 4.5 },
    { day: "Sat", hours: 2.8 },
    { day: "Sun", hours: 3.2 },
  ], []);

  const habitData: HabitData[] = useMemo(() => [
    { name: "Focused Work", value: 65, color: CHART_COLORS.primary },
    { name: "Breaks", value: 20, color: CHART_COLORS.secondary },
    { name: "Distractions", value: 15, color: CHART_COLORS.accent },
  ], []);

  const topDistractors: DistractorData[] = useMemo(() => [
    { site: "Social Media", time: 45 },
    { site: "News Sites", time: 32 },
    { site: "Messaging", time: 28 },
    { site: "Video Streaming", time: 18 },
    { site: "Shopping", time: 12 },
  ], []);

  const moodTags = useMemo(() => 
    ["calm", "focused", "productive", "grateful", "creative", "energized"], 
  []);

  const totalFocusHours = useMemo(() => getTotalHours(focusTrendData), [focusTrendData]);
  const scoreLabel = useMemo(() => getAuraScoreLabel(auraScore), [auraScore]);

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12 bg-gradient-to-b from-background to-background/95">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Personal Insights
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Your wellness and productivity patterns visualized
          </p>
        </header>

        {/* Aura Score */}
        <Card className="glass-card border-0 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse-glow" />
          <CardContent className="p-6 sm:p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <AuraScoreDisplay score={auraScore} />
              
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl sm:text-3xl font-bold">Overall Wellness Score</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Your Aura score combines focus time, mood patterns, and digital wellness habits. 
                    You're in the <span className="text-primary font-semibold capitalize">{scoreLabel}</span> range!
                  </p>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <StatIndicator color="bg-primary" label="Focus: Strong" />
                  <StatIndicator color="bg-secondary" label="Mood: Positive" />
                  <StatIndicator color="bg-accent" label="Balance: Good" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Focus Trends */}
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Focus Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-primary">{totalFocusHours.toFixed(1)} hours</p>
                <p className="text-sm text-muted-foreground">Total focus time this week</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={focusTrendData}>
                  <XAxis 
                    dataKey="day" 
                    stroke={CHART_COLORS.muted}
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={CHART_COLORS.muted}
                    fontSize={12}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.primary, r: 5, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm">
                  Peak productivity: <span className="text-primary font-semibold">Thursday 10-11 AM</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Digital Habits */}
          <Card className="glass-card border-0 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-secondary" />
                Digital Habits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={habitData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {habitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {habitData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-primary">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood & Journal Overview */}
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Mood & Journal Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3 font-medium">Most frequent moods this week:</p>
              <div className="flex gap-2 flex-wrap">
                {moodTags.map((mood, index) => (
                  <MoodTag key={mood} mood={mood} index={index} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                "from-primary/50 to-secondary/50",
                "from-secondary/50 to-accent/50",
                "from-accent/50 to-primary/50"
              ].map((gradient, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl bg-gradient-to-br ${gradient} hover-lift cursor-pointer transition-all hover:scale-105 shadow-lg`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Journal entry ${i + 1}`}
                />
              ))}
            </div>
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
              <p className="text-sm">
                <span className="text-foreground font-semibold">12 journal entries</span> created this month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Distractors */}
        <Card className="glass-card border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Distractors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topDistractors} layout="vertical">
                <XAxis 
                  type="number" 
                  stroke={CHART_COLORS.muted}
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  type="category" 
                  dataKey="site" 
                  stroke={CHART_COLORS.muted}
                  fontSize={12}
                  width={120}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="time" 
                  fill={CHART_COLORS.accent}
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/10 mt-4">
              <p className="text-sm">
                💡 Consider blocking or limiting access to these sites during focus sessions
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Weekly Report */}
        <Card className="glass-card border-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 shadow-xl">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  AI Weekly Summary
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">NEW</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Excellent work this week! Your focus sessions have been consistently strong, especially 
                  in the mornings. Your journal entries show a positive emotional trajectory, with "calm" 
                  and "focused" appearing frequently. Consider maintaining your current schedule – your 
                  Thursday productivity spike suggests you've found an optimal rhythm. Keep up the mindful 
                  morning routine; it's clearly working well for you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
