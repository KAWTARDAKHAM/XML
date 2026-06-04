
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { User, Bell, Monitor, Camera, Save, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings-context';
import { cn } from '@/lib/utils';

type SettingsSection = 'profile' | 'display' | 'notifications';

export default function SettingsPage() {
  const { t, language, setLanguage, theme, setTheme, user, updateUser } = useSettings();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: language === 'fr' ? "Paramètres synchronisés" : "Settings Synchronized",
        description: language === 'fr' ? "Vos modifications ont été enregistrées." : "Changes have been saved.",
      });
    }, 1000);
  };

  const handleVerifyEmail = () => {
    setIsVerifying(true);
    toast({
      title: "Verification sent",
      description: `A magic link has been sent to ${user.email}.`,
    });
    setTimeout(() => {
      setIsVerifying(false);
      updateUser({ isVerified: true });
      toast({
        title: "Email Verified",
        description: "Your identity has been confirmed.",
      });
    }, 3000);
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: SettingsSection, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveSection(id)}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group",
        activeSection === id 
          ? "bg-primary/10 text-primary shadow-inner" 
          : "text-muted-foreground hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon size={20} className={cn("transition-transform duration-300", activeSection === id ? "scale-110" : "group-hover:scale-110")} />
      <span className="text-sm font-bold tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
          <header>
            <h1 className="text-4xl font-headline font-bold tracking-tight">{t.settings.title}</h1>
            <p className="text-muted-foreground mt-2">{t.settings.subtitle}</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="glass p-3 rounded-[2.5rem] border-white/5 space-y-2 sticky top-8">
                <SidebarItem id="profile" icon={User} label={t.settings.sections.profile} />
                <SidebarItem id="display" icon={Monitor} label={t.settings.sections.display} />
                <SidebarItem id="notifications" icon={Bell} label={t.settings.sections.notifications} />
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {activeSection === 'profile' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <Card className="glass border-white/5 overflow-hidden rounded-[2.5rem]">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center px-8">
                      <div className="relative group">
                        <Avatar className="w-20 h-20 border-4 border-background shadow-2xl">
                          <AvatarImage src={`https://picsum.photos/seed/${user.firstName}/100/100`} />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                          <Camera className="text-white" size={18} />
                        </button>
                      </div>
                      <div className="ml-6">
                        <h2 className="text-xl font-headline font-bold">{user.firstName} {user.lastName}</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest">Product Architect</p>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.settings.firstName}</Label>
                          <Input 
                            value={user.firstName} 
                            onChange={(e) => updateUser({ firstName: e.target.value })}
                            className="bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.settings.lastName}</Label>
                          <Input 
                            value={user.lastName} 
                            onChange={(e) => updateUser({ lastName: e.target.value })}
                            className="bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" 
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.settings.email}</Label>
                          <div className="flex gap-3">
                            <Input 
                              value={user.email} 
                              onChange={(e) => updateUser({ email: e.target.value, isVerified: false })}
                              className="bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" 
                            />
                            {user.isVerified ? (
                              <div className="flex items-center gap-2 px-4 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20 text-xs font-bold whitespace-nowrap">
                                <ShieldCheck size={16} />
                                {t.settings.emailVerified}
                              </div>
                            ) : (
                              <Button 
                                onClick={handleVerifyEmail}
                                disabled={isVerifying}
                                className="bg-primary/20 text-primary hover:bg-primary/30 rounded-xl text-xs font-bold px-4"
                              >
                                {isVerifying ? t.settings.emailPending : t.settings.verifyEmail}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'display' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <Card className="glass border-white/5 rounded-[2.5rem]">
                    <CardHeader className="p-8">
                      <CardTitle className="text-xl font-headline flex items-center gap-3">
                        <Monitor size={22} className="text-accent" />
                        {t.settings.systemConfig}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.settings.theme}</Label>
                        <Select value={theme} onValueChange={(v: any) => setTheme(v)}>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/10">
                            <SelectItem value="dark">{t.settings.themeDark}</SelectItem>
                            <SelectItem value="light">{t.settings.themeLight}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.settings.language}</Label>
                        <Select value={language} onValueChange={(v: any) => setLanguage(v)}>
                          <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="glass border-white/10">
                            <SelectItem value="fr">Français (FR)</SelectItem>
                            <SelectItem value="en">English (US)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <Card className="glass border-white/5 rounded-[2.5rem]">
                    <CardHeader className="p-8">
                      <CardTitle className="text-xl font-headline flex items-center gap-3">
                        <Bell size={22} className="text-rose-400" />
                        {t.settings.alertProtocols}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-4">
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white/[0.08] transition-colors">
                        <div className="space-y-1">
                          <Label className="text-base font-bold">{t.settings.deadlineAlerts}</Label>
                          <p className="text-xs text-muted-foreground max-w-md">{t.settings.deadlineDesc}</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between p-6 bg-white/5 rounded-[1.5rem] border border-white/5 hover:bg-white/[0.08] transition-colors">
                        <div className="space-y-1">
                          <Label className="text-base font-bold">{t.settings.weeklySummary}</Label>
                          <p className="text-xs text-muted-foreground max-w-md">{t.settings.weeklyDesc}</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/80 text-white rounded-2xl px-12 h-14 shadow-xl shadow-primary/20 font-bold transition-all hover:scale-105 active:scale-95"
                >
                  {isSaving ? t.settings.saving : t.settings.save}
                  {!isSaving && <Save size={20} className="ml-2" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
