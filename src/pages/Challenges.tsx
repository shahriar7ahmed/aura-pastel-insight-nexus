import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Sun, Moon, Zap, Trophy, Lock, LucideIcon } from "lucide-react";
import { memo } from "react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  progress: number;
  status: "active" | "locked";
  color: string;
  bgColor: string;
}

interface CompletedChallenge {
  title: string;
  completedDate: string;
  reward: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Mindful Morning",
    description: "Start your day with 30 minutes of focused work before checking any notifications",
    icon: Sun,
    duration: "7 days",
    progress: 60,
    status: "active",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: 2,
    title: "Digital Sunset",
    description: "No screens 1 hour before bedtime to improve sleep quality",
    icon: Moon,
    duration: "14 days",
    progress: 35,
    status: "active",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    id: 3,
    title: "Focus Marathon",
    description: "Complete 5 deep work sessions this week without distractions",
    icon: Zap,
    duration: "1 week",
    progress: 80,
    status: "active",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: 4,
    title: "Weekend Warrior",
    description: "Take a full digital detox over the weekend",
    icon: Target,
    duration: "2 days",
    progress: 0,
    status: "locked",
    color: "text-muted-foreground",
    bgColor: "bg-muted/10",
  },
];

const COMPLETED_CHALLENGES: CompletedChallenge[] = [
  {
    title: "Email Zen",
    completedDate: "2 weeks ago",
    reward: "Unlocked 'Ocean Waves' soundscape",
  },
  {
    title: "Social Media Fast",
    completedDate: "1 month ago",
    reward: "Unlocked 'Aurora' journal theme",
  },
];

const ChallengeCard = memo(({ challenge }: { challenge: Challenge }) => {
  const Icon = challenge.icon;
  const isLocked = challenge.status === "locked";
  const hasProgress = challenge.progress > 0;

  return (
    <Card className={`glass-card border-0 overflow-hidden ${!isLocked ? "hover-lift cursor-pointer" : "opacity-60"}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-2xl ${challenge.bgColor} ${challenge.color}`}>
              {isLocked ? <Lock className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <div>
              <CardTitle className="text-xl">{challenge.title}</CardTitle>
              <Badge variant="outline" className="mt-1 text-xs">
                {challenge.duration}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{challenge.description}</p>

        {!isLocked ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{challenge.progress}%</span>
              </div>
              <Progress value={challenge.progress} className="h-2" />
            </div>

            <Button
              variant={hasProgress ? "default" : "outline"}
              className={`w-full rounded-full ${hasProgress ? "bg-primary hover:bg-primary/90" : "glass-card border-primary/20"}`}
            >
              {hasProgress ? "Continue Challenge" : "Start Challenge"}
            </Button>
          </>
        ) : (
          <Button variant="outline" className="w-full rounded-full glass-card" disabled>
            <Lock className="w-4 h-4 mr-2" />
            Complete previous challenges to unlock
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

ChallengeCard.displayName = "ChallengeCard";

const CompletedChallengeCard = memo(({ challenge }: { challenge: CompletedChallenge }) => (
  <Card className="glass-card border-0">
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold">{challenge.title}</p>
          <p className="text-xs text-muted-foreground">{challenge.completedDate}</p>
        </div>
      </div>
      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
        {challenge.reward}
      </Badge>
    </CardContent>
  </Card>
));

CompletedChallengeCard.displayName = "CompletedChallengeCard";

const Challenges = () => {
  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">Digital Detox Challenges</h1>
          <p className="text-muted-foreground text-lg">
            Build healthier digital habits through gamified experiences
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Active Challenges</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {CHALLENGES.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Completed Challenges
          </h2>
          <div className="space-y-3">
            {COMPLETED_CHALLENGES.map((challenge, index) => (
              <CompletedChallengeCard key={index} challenge={challenge} />
            ))}
          </div>
        </section>

        <Card className="glass-card border-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardContent className="p-8 text-center space-y-4">
            <Trophy className="w-12 h-12 text-primary mx-auto" />
            <div>
              <h3 className="text-xl font-semibold mb-2">Join the Community</h3>
              <p className="text-muted-foreground">
                Compare your progress with others and climb the wellness leaderboard
              </p>
            </div>
            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90">
              View Leaderboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Challenges;
