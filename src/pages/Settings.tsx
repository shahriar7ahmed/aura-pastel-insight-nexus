import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Palette, Calendar, Music, Shield, CreditCard } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-lg">Customize your Aura experience</p>
        </div>

        {/* Profile Settings */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Alex Chen" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex@example.com" className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="UTC-8 (Pacific Time)" className="rounded-xl" />
            </div>
            <Button className="rounded-full bg-primary hover:bg-primary/90">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Focus Reminders</p>
                <p className="text-sm text-muted-foreground">Get nudged to start focus sessions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Challenge Updates</p>
                <p className="text-sm text-muted-foreground">Progress notifications for active challenges</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Insights</p>
                <p className="text-sm text-muted-foreground">Receive AI-generated weekly summaries</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Distraction Alerts</p>
                <p className="text-sm text-muted-foreground">Gentle reminders when drifting off-task</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Time-Based Color Shifts</p>
                <p className="text-sm text-muted-foreground">Background adapts to time of day</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fluid Animations</p>
                <p className="text-sm text-muted-foreground">Enable organic motion effects</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reduce Motion</p>
                <p className="text-sm text-muted-foreground">Minimize animations for accessibility</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Google Calendar</p>
                  <p className="text-sm text-muted-foreground">Not connected</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-full glass-card border-primary/20">
                Connect
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Music className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="font-medium">Spotify</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-full glass-card border-primary/20">
                Disconnect
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Browser Extension</p>
                  <p className="text-sm text-muted-foreground">Not installed</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-full glass-card border-primary/20">
                Install
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="glass-card border-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Subscription & Billing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg">Aura Pro</p>
                <p className="text-sm text-muted-foreground">$9.99/month • Next billing: May 15, 2024</p>
              </div>
              <Button variant="outline" className="rounded-full glass-card border-primary/20">
                Manage
              </Button>
            </div>
            <div className="p-4 rounded-2xl bg-background/50 backdrop-blur space-y-2">
              <p className="text-sm font-medium">Pro Features Enabled:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Unlimited focus sessions</li>
                <li>Advanced AI insights & recommendations</li>
                <li>Custom soundscapes & journal themes</li>
                <li>Priority support</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="rounded-full glass-card border-primary/20 w-full">
              Change Password
            </Button>
            <Button variant="outline" className="rounded-full glass-card border-primary/20 w-full">
              Enable Two-Factor Authentication
            </Button>
            <Separator />
            <Button variant="destructive" className="rounded-full w-full">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
