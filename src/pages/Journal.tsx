import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, Save } from "lucide-react";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const moodTags = ["grateful", "stressed", "calm", "excited", "tired", "focused", "creative", "anxious"];

  const mockEntries = [
    {
      date: "Today, 2:30 PM",
      preview: "Had a productive morning session...",
      moods: ["focused", "calm"],
      gradient: "from-primary/60 via-secondary/60 to-accent/60",
    },
    {
      date: "Yesterday, 4:15 PM",
      preview: "Feeling grateful for the progress...",
      moods: ["grateful", "excited"],
      gradient: "from-accent/60 via-primary/60 to-secondary/60",
    },
    {
      date: "2 days ago",
      preview: "Challenging day but learned a lot...",
      moods: ["stressed", "creative"],
      gradient: "from-secondary/60 via-accent/60 to-primary/60",
    },
  ];

  const toggleMood = (mood: string) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="grid lg:grid-cols-[350px_1fr] gap-6">
          {/* Past Entries Sidebar */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Your Journal
            </h2>
            <div className="space-y-3">
              {mockEntries.map((entry, index) => (
                <Card
                  key={index}
                  className="glass-card hover-lift border-0 cursor-pointer group overflow-hidden"
                >
                  <div className={`h-20 bg-gradient-to-br ${entry.gradient} relative`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                    <p className="text-sm line-clamp-2">{entry.preview}</p>
                    <div className="flex gap-1 flex-wrap">
                      {entry.moods.map((mood) => (
                        <Badge
                          key={mood}
                          variant="secondary"
                          className="text-xs bg-primary/10 text-primary border-0"
                        >
                          #{mood}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Editor */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Generative Art Journal</h1>
              <p className="text-muted-foreground">Your thoughts become art as you write</p>
            </div>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  New Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Writing Area */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">How are you feeling today?</label>
                  <Textarea
                    placeholder="Start typing your thoughts..."
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    className="min-h-[200px] text-lg rounded-2xl border-primary/20 bg-background/50 backdrop-blur resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    As you type, AI analyzes your sentiment and generates art in real-time
                  </p>
                </div>

                {/* Mood Tags */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tag your mood</label>
                  <div className="flex gap-2 flex-wrap">
                    {moodTags.map((mood) => (
                      <Badge
                        key={mood}
                        variant={selectedMoods.includes(mood) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          selectedMoods.includes(mood)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => toggleMood(mood)}
                      >
                        #{mood}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Live Art Preview */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Live Art Generation</label>
                  <div className="relative h-64 rounded-2xl overflow-hidden glass-card">
                    {entry ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40 blur-2xl animate-pulse-glow" />
                        <div className="absolute inset-4 bg-gradient-to-tr from-accent/50 via-primary/50 to-secondary/50 rounded-full blur-xl" />
                        <div className="absolute inset-8 bg-gradient-to-bl from-secondary/60 via-accent/60 to-primary/60 rounded-full blur-lg animate-float" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">Art evolving with your words...</p>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Start writing to see your art...</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                <Button
                  size="lg"
                  className="w-full rounded-full bg-primary hover:bg-primary/90 shadow-soft"
                  disabled={!entry}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry & Generate Art
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
