
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle, User, Briefcase, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface DashboardProps {
  tickets: any[];
}

const Dashboard = ({ tickets }: DashboardProps) => {
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile({
          ...profile,
          email: user.email,
          full_name: profile?.full_name || user.user_metadata?.full_name || 'Utilisateur',
          profession: profile?.profession || 'Non spécifié'
        });
      }
    };

    fetchUserProfile();
  }, []);

  // Générer les données pour le graphique hebdomadaire
  const getWeeklyData = () => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekTickets = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate >= weekStart && ticketDate <= weekEnd;
      });

      weeks.push({
        week: `S${7-i}`,
        interventions: weekTickets.length,
        date: weekStart.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
      });
    }
    
    return weeks;
  };

  const weeklyData = getWeeklyData();

  // Statistiques générales
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;
  const thisWeekTickets = tickets.filter(t => {
    const ticketDate = new Date(t.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return ticketDate >= weekAgo;
  }).length;

  const stats = [
    {
      title: 'Total interventions',
      value: totalTickets,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'En cours',
      value: openTickets,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      title: 'Terminées',
      value: closedTickets,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'Cette semaine',
      value: thisWeekTickets,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    }
  ];

  // Données par priorité
  const priorityData = [
    { name: 'Élevée', value: tickets.filter(t => t.priority === 'high').length, color: '#ef4444' },
    { name: 'Moyenne', value: tickets.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
    { name: 'Faible', value: tickets.filter(t => t.priority === 'low').length, color: '#10b981' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 pt-20 pb-8">
      <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6">
        {/* Sidebar Profile */}
        <div className="w-80 flex-shrink-0">
          <Card className="glass-card sticky top-24">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {userProfile?.full_name || 'Chargement...'}
                  </h2>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {userProfile?.profession || 'Chargement...'}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3 w-full">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{userProfile?.email || 'Chargement...'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>ID: {userProfile?.id?.slice(0, 8) || '...'}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <p className="text-lg font-semibold text-foreground">{tickets.length}</p>
                    <p className="text-xs text-muted-foreground">Tickets Total</p>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg">
                    <p className="text-lg font-semibold text-foreground">
                      {tickets.filter(t => t.status === 'closed').length}
                    </p>
                    <p className="text-xs text-muted-foreground">Terminés</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Vue d'ensemble des interventions RADEMA</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="glass-card hover-scale p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`${stat.color} w-6 h-6`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Graphique hebdomadaire */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="mr-2 text-primary" size={20} />
              Interventions hebdomadaires
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    formatter={(value: number) => [value, 'Interventions']}
                    labelFormatter={(label) => `Semaine ${label}`}
                  />
                  <Bar 
                    dataKey="interventions" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Répartition par priorité */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Répartition par priorité</h2>
            <div className="space-y-4">
              {priorityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-foreground">{item.value}</span>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${totalTickets > 0 ? (item.value / totalTickets) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalTickets === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune intervention créée pour le moment</p>
              </div>
            )}
          </div>
        </div>

        {/* Tickets récents */}
        {tickets.length > 0 && (
          <div className="mt-8">
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Dernières interventions</h2>
              <div className="space-y-3">
                {tickets.slice(-5).reverse().map((ticket, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground truncate">{ticket.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Assigné à {ticket.assignedTo} • {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.priority === 'high' 
                          ? 'bg-red-500/20 text-red-400' 
                          : ticket.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {ticket.priority === 'high' ? 'Élevée' : 
                         ticket.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.status === 'open' 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {ticket.status === 'open' ? 'Ouvert' : 'Fermé'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
