
"use client"

import { DashboardNav } from '@/components/dashboard/dashboard-nav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { User, Bell, Monitor, Globe, Camera, Save } from 'lucide-react';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Paramètres synchronisés",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <DashboardNav />
      <main className="pl-20 p-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
          <header>
            <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Configuration Système</h1>
            <p className="text-muted-foreground mt-2">Gérez vos préférences personnelles et vos protocoles d'alerte</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne Gauche - Profil & Photo */}
            <div className="space-y-6">
              <Card className="glass border-white/5 overflow-hidden rounded-[2rem]">
                <div className="h-32 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-[#09090B] shadow-2xl">
                      <AvatarImage src="https://picsum.photos/seed/42/100/100" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                      <Camera className="text-white" size={20} />
                    </button>
                  </div>
                </div>
                <CardContent className="pt-6 text-center">
                  <h2 className="text-xl font-headline font-bold">John Doe</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Product Architect</p>
                  <Button variant="outline" className="w-full mt-6 glass border-white/10 rounded-xl text-xs uppercase font-bold tracking-widest h-10">
                    Changer la photo
                  </Button>
                </CardContent>
              </Card>

              <div className="glass p-4 rounded-2xl border-white/5 space-y-2">
                <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl text-primary">
                  <User size={18} />
                  <span className="text-sm font-semibold">Profil</span>
                </div>
                <div className="flex items-center gap-3 p-3 text-muted-foreground hover:text-white transition-colors cursor-pointer">
                  <Monitor size={18} />
                  <span className="text-sm font-semibold">Affichage</span>
                </div>
                <div className="flex items-center gap-3 p-3 text-muted-foreground hover:text-white transition-colors cursor-pointer">
                  <Bell size={18} />
                  <span className="text-sm font-semibold">Notifications</span>
                </div>
              </div>
            </div>

            {/* Colonne Droite - Formulaires */}
            <div className="lg:col-span-2 space-y-6">
              {/* Infos Personnelles */}
              <Card className="glass border-white/5 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <User size={20} className="text-primary" />
                    Informations Personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Prénom</Label>
                    <Input defaultValue="John" className="bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Nom</Label>
                    <Input defaultValue="Doe" className="bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email de contact</Label>
                    <Input defaultValue="john.doe@fluentgantt.io" className="bg-white/5 border-white/10 rounded-xl focus:ring-primary/40" />
                  </div>
                </CardContent>
              </Card>

              {/* Système : Langue & Thème */}
              <Card className="glass border-white/5 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <Monitor size={20} className="text-accent" />
                    Configuration Système
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Thème d'Interface</Label>
                    <Select defaultValue="dark">
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                        <SelectValue placeholder="Choisir un thème" />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/10">
                        <SelectItem value="dark">Mode Sombre (Obsidian)</SelectItem>
                        <SelectItem value="light">Mode Clair (Frost)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Langue</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                        <SelectValue placeholder="Choisir une langue" />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/10">
                        <SelectItem value="fr">Français (FR)</SelectItem>
                        <SelectItem value="en">English (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="glass border-white/5 rounded-[2rem]">
                <CardHeader>
                  <CardTitle className="text-lg font-headline flex items-center gap-2">
                    <Bell size={20} className="text-rose-400" />
                    Protocoles d'Alerte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold text-white">Alertes de date limite</Label>
                      <p className="text-xs text-muted-foreground">Recevoir un email si une tâche non terminée approche de son échéance.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold text-white">Résumé hebdomadaire</Label>
                      <p className="text-xs text-muted-foreground">Rapport d'activité consolidé chaque lundi matin.</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/80 text-white rounded-xl px-10 h-12 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-105"
                >
                  {isSaving ? "Synchronisation..." : "Enregistrer les modifications"}
                  {!isSaving && <Save size={18} className="ml-2" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
