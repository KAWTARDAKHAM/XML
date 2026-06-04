"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { User, Bell, Shield, Palette } from 'lucide-react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-4xl font-headline font-bold text-white">System Settings</h1>
            <p className="text-muted-foreground mt-2">Customize your experience and notification preferences</p>
          </header>

          <div className="grid gap-6">
            <Card className="glass border-white/5 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/40 to-accent/40" />
              <CardContent className="relative pt-12">
                <Avatar className="absolute -top-12 left-6 w-24 h-24 border-4 border-background shadow-xl">
                  <AvatarImage src="https://picsum.photos/seed/42/100/100" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-headline font-bold text-white">John Doe</h2>
                    <p className="text-muted-foreground text-sm">Product Manager • Project Lead</p>
                  </div>
                  <Button variant="outline" className="glass border-white/10 rounded-xl">Update Photo</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <Button variant="ghost" className="w-full justify-start text-primary bg-primary/5 rounded-xl font-medium">
                  <User size={18} className="mr-3" /> Profile Info
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white rounded-xl">
                  <Bell size={18} className="mr-3" /> Notifications
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white rounded-xl">
                  <Palette size={18} className="mr-3" /> Appearance
                </Button>
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white rounded-xl">
                  <Shield size={18} className="mr-3" /> Security
                </Button>
              </div>

              <div className="md:col-span-2 space-y-6">
                <Card className="glass border-white/5">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline text-white">Basic Information</CardTitle>
                    <CardDescription>Personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email Address</Label>
                      <Input defaultValue="john.doe@example.com" className="bg-white/5 border-white/10 text-white" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs text-muted-foreground uppercase tracking-wider">Display Name</Label>
                      <Input defaultValue="John Doe" className="bg-white/5 border-white/10 text-white" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-white/5">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline text-white">Notification Settings</CardTitle>
                    <CardDescription>Control how you receive task updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm text-white">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive daily summaries of pending tasks</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm text-white">Urgent Alerts</Label>
                        <p className="text-xs text-muted-foreground">Immediate notification for critical priority shifts</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/80 text-white rounded-xl px-8 shadow-lg shadow-primary/20"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
