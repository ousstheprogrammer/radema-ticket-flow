
import React, { useState } from 'react';
import { User, Clock, Shield, Database, Activity, LogOut, Key, Bell, Palette, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SettingsPageProps {
  currentUser: any;
  tickets: any[];
  onLogout: () => void;
}

const SettingsPage = ({ currentUser, tickets, onLogout }: SettingsPageProps) => {
  const [userInfo, setUserInfo] = useState({
    username: currentUser?.username || '',
    email: '',
    department: 'Développement Commercial',
    role: 'Agent Commercial'
  });

  const handleSaveProfile = () => {
    toast.success('Profil mis à jour avec succès!');
  };

  const handleChangePassword = () => {
    toast.info('Fonctionnalité de changement de mot de passe à venir');
  };

  const loginTime = currentUser?.loginTime ? new Date(currentUser.loginTime) : new Date();
  const sessionDuration = Math.floor((Date.now() - loginTime.getTime()) / (1000 * 60));

  const userStats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    closedTickets: tickets.filter(t => t.status === 'closed').length,
    sessionTime: sessionDuration
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez votre profil et les paramètres de l'application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profil utilisateur */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Profil utilisateur</span>
                </CardTitle>
                <CardDescription>
                  Informations personnelles et professionnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      value={userInfo.username}
                      onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                      placeholder="votre.email@radema.ma"
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Département</Label>
                    <Input
                      id="department"
                      value={userInfo.department}
                      readOnly
                      className="bg-muted border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      value={userInfo.role}
                      onChange={(e) => setUserInfo({...userInfo, role: e.target.value})}
                      className="bg-input border-border"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Sauvegarder le profil
                </Button>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Sécurité</span>
                </CardTitle>
                <CardDescription>
                  Gérez vos paramètres de sécurité
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleChangePassword} variant="outline" className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Recevoir les alertes système</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            {/* Système */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-primary" />
                  <span>Informations système</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span>Version: 1.0.0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <span>Thème: Sombre</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec statistiques */}
          <div className="space-y-6">
            {/* Informations de session */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Session actuelle</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Utilisateur</span>
                    <span className="font-medium">{currentUser?.username}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connexion</span>
                    <span className="text-sm">{loginTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Durée</span>
                    <span className="text-sm">{sessionDuration} min</span>
                  </div>
                </div>
                <Button onClick={onLogout} variant="destructive" className="w-full">
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>
              </CardContent>
            </Card>

            {/* Statistiques utilisateur */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Mes statistiques</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{userStats.totalTickets}</div>
                    <div className="text-xs text-muted-foreground">Total tickets</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-500">{userStats.openTickets}</div>
                    <div className="text-xs text-muted-foreground">En cours</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-500">{userStats.closedTickets}</div>
                    <div className="text-xs text-muted-foreground">Fermés</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">{sessionDuration}</div>
                    <div className="text-xs text-muted-foreground">Min session</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations RADEMA */}
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-center gradient-text">RADEMA</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Régie Autonome de Distribution
                </p>
                <p className="text-sm text-muted-foreground">
                  d'Eau et d'Électricité de Marrakech
                </p>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Département de Développement Commercial
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
