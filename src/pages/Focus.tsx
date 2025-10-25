import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Focus = () => {
  const [taskIntent, setTaskIntent] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const totalTime = 25 * 60;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto animate-fade-in">
        {/* Ambient Background Effect */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">The Sanctuary</h1>
            <p className="text-muted-foreground text-lg">Enter your focus zone</p>
          </div>

          {/* Main Focus Card */}
          <Card className="glass-card border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12 space-y-8">
              {/* Task Intent Input */}
              {!isRunning && (
                <div className="space-y-4 animate-fade-in">
                  <label className="text-sm font-medium text-muted-foreground">
                    What are you working on?
                  </label>
                  <Input
                    placeholder="e.g., Study for physics exam"
                    value={taskIntent}
                    onChange={(e) => setTaskIntent(e.target.value)}
                    className="text-lg h-14 rounded-2xl border-primary/20 bg-background/50 backdrop-blur"
                  />
                  <p className="text-xs text-muted-foreground">
                    AI will categorize your task and adjust the environment accordingly
                  </p>
                </div>
              )}

              {/* Timer Display */}
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="text-8xl md:text-9xl font-bold tabular-nums">
                    {formatTime(timeRemaining)}
                  </div>
                  {isRunning && (
                    <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse-glow" />
                  )}
                </div>

                {/* Progress Visualization */}
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(progress)}% complete
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setIsRunning(!isRunning)}
                  className="rounded-full w-20 h-20 bg-primary hover:bg-primary/90 shadow-elevated"
                  disabled={!isRunning && !taskIntent}
                >
                  {isRunning ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setTimeRemaining(totalTime)}
                  className="rounded-full w-16 h-16 glass-card border-primary/20"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full w-16 h-16 glass-card border-primary/20"
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
              </div>

              {/* Task Category Display (when running) */}
              {isRunning && taskIntent && (
                <div className="text-center space-y-2 animate-fade-in">
                  <p className="text-sm text-muted-foreground">Current Task:</p>
                  <p className="text-xl font-semibold">{taskIntent}</p>
                  <div className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    Analytical Work
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Focus Tips */}
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse-glow" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Focus Tip:</span> During your session, 
                    Aura will gently remind you if you drift away to distracting sites. Your environment 
                    adapts to your task type for optimal concentration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Focus;
