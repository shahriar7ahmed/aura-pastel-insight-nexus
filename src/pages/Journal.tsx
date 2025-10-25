import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, Save, Calendar, Search, Filter, Plus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMood, setFilterMood] = useState<string | null>(null);

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
    <div className="min-h-screen pt-20 px-4 md:px-6 pb-12 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Generative Art Journal
          </h1>
          <p className="text-muted-foreground text-lg">Transform your thoughts into beautiful art</p>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Enhanced Sidebar */}
          <div className="space-y-4">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Past Entries
              </h2>
              <Button size="sm" variant="ghost" className="rounded-full">
                <Calendar className="w-4 h-4" />
              </Button>
            </div>

            {/* Search & Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-full border-primary/20 bg-background/50 backdrop-blur"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Button
                  size="sm"
                  variant={filterMood === null ? "default" : "outline"}
                  onClick={() => setFilterMood(null)}
                  className="rounded-full whitespace-nowrap"
                >
                  All
                </Button>
                {moodTags.slice(0, 4).map((mood) => (
                  <Button
                    key={mood}
                    size="sm"
                    variant={filterMood === mood ? "default" : "outline"}
                    onClick={() => setFilterMood(mood)}
                    className="rounded-full whitespace-nowrap"
                  >
                    {mood}
                  </Button>
                ))}
                <Button size="sm" variant="outline" className="rounded-full">
                  <Filter className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Entries List */}
            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 scrollbar-thin">
              {mockEntries.map((entry, index) => (
                <Card
                  key={index}
                  className="glass-card hover-lift border-0 cursor-pointer group overflow-hidden transition-all hover:shadow-lg"
                >
                  <div className={`h-16 bg-gradient-to-br ${entry.gradient} relative`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute top-2 right-2">
                      <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-medium">{entry.date}</p>
                    </div>
                    <p className="text-sm line-clamp-2 text-foreground/80">{entry.preview}</p>
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

            {/* New Entry Button (Mobile) */}
            <Button className="w-full lg:hidden rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Enhanced Main Editor */}
          <div className="space-y-6">
            <Card className="glass-card border-0 shadow-xl">
              <CardHeader className="border-b border-primary/10">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  New Entry
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {entry.length} characters
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Writing Area */}
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    How are you feeling today?
                    <span className="text-xs text-muted-foreground font-normal">(AI analyzing...)</span>
                  </label>
                  <Textarea
                    placeholder="Start typing your thoughts... Let your creativity flow freely."
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    className="min-h-[240px] text-base leading-relaxed rounded-2xl border-primary/20 bg-background/50 backdrop-blur resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p>AI-generated art updates as you write</p>
                    {entry && <p className="text-primary">✓ Auto-saved</p>}
                  </div>
                </div>

                {/* Mood Tags */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tag your mood</label>
                  <div className="flex gap-2 flex-wrap">
                    {moodTags.map((mood) => (
                      <Badge
                        key={mood}
                        variant={selectedMoods.includes(mood) ? "default" : "outline"}
                        className={`cursor-pointer transition-all hover:scale-105 ${
                          selectedMoods.includes(mood)
                            ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md"
                            : "hover:bg-primary/10 hover:border-primary/50"
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
                  <label className="text-sm font-medium flex items-center gap-2">
                    Live Art Generation
                    {entry && <span className="text-xs text-muted-foreground font-normal">(Evolving...)</span>}
                  </label>
                  <div className="relative h-80 rounded-2xl overflow-hidden glass-card border border-primary/10">
                    {entry ? (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40 blur-3xl animate-pulse-glow" />
                        <div className="absolute inset-4 bg-gradient-to-tr from-accent/50 via-primary/50 to-secondary/50 rounded-full blur-2xl animate-spin-slow" />
                        <div className="absolute inset-8 bg-gradient-to-bl from-secondary/60 via-accent/60 to-primary/60 rounded-full blur-xl animate-float" />
                        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
                          <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                              <p className="text-sm font-medium">Art evolving with your words</p>
                              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100" />
                            </div>
                            <p className="text-xs text-muted-foreground">Sentiment: Calm & Reflective</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center space-y-3">
                          <Sparkles className="w-12 h-12 text-primary/50 mx-auto" />
                          <p className="text-sm text-muted-foreground">Start writing to see your art come alive...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all"
                    disabled={!entry}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save & Generate Art
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full"
                    disabled={!entry}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
