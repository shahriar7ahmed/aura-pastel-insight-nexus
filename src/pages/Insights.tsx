import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Heart, Smartphone, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const Insights = () => {
  const auraScore = 85;

  const focusTrendData = [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 4.2 },
    { day: "Wed", hours: 3.8 },
    { day: "Thu", hours: 5.1 },
    { day: "Fri", hours: 4.5 },
    { day: "Sat", hours: 2.8 },
    { day: "Sun", hours: 3.2 },
  ];

  const habitData = [
    { name: "Focused Work", value: 65, color: "hsl(var(--primary))" },
    { name: "Breaks", value: 20, color: "hsl(var(--secondary))" },
    { name: "Distractions", value: 15, color: "hsl(var(--accent))" },
  ];

  const topDistractors = [
    { site: "Social Media", time: 45 },
    { site: "News Sites", time: 32 },
    { site: "Messaging", time: 28 },
    { site: "Video Streaming", time: 18 },
    { site: "Shopping", time: 12 },
  ];

  const moodTags = ["calm", "focused", "productive", "grateful", "creative", "energized"];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">Personal Insights</h1>
          <p className="text-muted-foreground text-lg">
            Your wellness and productivity patterns visualized
          </p>
        </div>

        {/* Aura Score */}
        <Card className="glass-card border-0 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse-glow" />
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-full glass-card flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
                      {auraScore}
                    </div>
                    <div className="text-sm text-muted-foreground">out of 100</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-2xl -z-10" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Overall Wellness Score</h2>
                  <p className="text-muted-foreground">
                    Your Aura score combines focus time, mood patterns, and digital wellness habits. 
                    You're in the <span className="text-primary font-semibold">excellent</span> range!
                  </p>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm">Focus: Strong</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <span className="text-sm">Mood: Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                    <span className="text-sm">Balance: Good</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Focus Trends */}
          <Card className="glass-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Focus Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-3xl font-bold">28.1 hours</p>
                <p className="text-sm text-muted-foreground">Total focus time this week</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={focusTrendData}>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-muted-foreground">
                Peak productivity: <span className="text-primary font-semibold">Thursday 10-11 AM</span>
              </p>
            </CardContent>
          </Card>

          {/* Digital Habits */}
          <Card className="glass-card border-0">
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {habitData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood & Journal Overview */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" />
              Mood & Journal Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Most frequent moods this week:</p>
              <div className="flex gap-2 flex-wrap">
                {moodTags.map((mood, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-full glass-card text-sm font-medium"
                    style={{ fontSize: `${1 - index * 0.1}rem` }}
                  >
                    #{mood}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40 hover-lift cursor-pointer"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">12 journal entries</span> created this month
            </p>
          </CardContent>
        </Card>

        {/* Top Distractors */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Top Distractors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topDistractors} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="site" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="time" fill="hsl(var(--accent))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4">
              Consider blocking or limiting access to these sites during focus sessions
            </p>
          </CardContent>
        </Card>

        {/* AI Weekly Report */}
        <Card className="glass-card border-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardContent className="p-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">AI Weekly Summary</h3>
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
