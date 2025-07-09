
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Users, Clock } from 'lucide-react';

interface DashboardProps {
  tickets: any[];
}

const Dashboard = ({ tickets }: DashboardProps) => {
  // Préparer les données pour le graphique hebdomadaire
  const getWeeklyData = () => {
    const weeklyStats = {};
    const today = new Date();
    
    // Générer les 7 derniers jours
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayKey = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'numeric' });
      weeklyStats[dayKey] = 0;
    }
    
    // Compter les tickets par jour
    tickets.forEach(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      const dayKey = ticketDate.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'numeric' });
      if (weeklyStats.hasOwnProperty(dayKey)) {
        weeklyStats[dayKey]++;
      }
    });
    
    return Object.entries(weeklyStats).map(([day, count]) => ({
      day,
      interventions: count
    }));
  };

  // Données pour le graphique de priorités
  const getPriorityData = () => {
    const priorities = { low: 0, medium: 0, high: 0 };
    tickets.forEach(ticket => {
      priorities[ticket.priority]++;
    });
    
    return [
      { name: 'Faible', value: priorities.low, color: '#10B981' },
      { name: 'Moyenne', value: priorities.medium, color: '#F59E0B' },
      { name: 'Élevée', value: priorities.high, color: '#EF4444' }
    ];
  };

  // Données pour les statistiques par statut
  const getStatusStats = () => {
    const statuses = { open: 0, closed: 0, in_progress: 0 };
    tickets.forEach(ticket => {
      statuses[ticket.status] = (statuses[ticket.status] || 0) + 1;
    });
    
    return [
      { label: 'Ouvert', value: statuses.open, color: 'text-red-400', bg: 'bg-red-500/20' },
      { label: 'En cours', value: statuses.in_progress || 0, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
      { label: 'Fermé', value: statuses.closed, color: 'text-green-400', bg: 'bg-green-500/20' }
    ];
  };

  const weeklyData = getWeeklyData();
  const priorityData = getPriorityData();
  const statusStats = getStatusStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard Analytique</h1>
            <p className="text-muted-foreground">Vue d'ensemble des interventions - RADEMA Marrakech</p>
          </div>
          <div className="flex items-center space-x-2 glass-card px-4 py-2 rounded-lg">
            <Calendar size={18} className="text-primary" />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statusStats.map((stat, index) => (
            <div key={index} className="glass-card hover-scale p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Clock className={stat.color} size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Graphique hebdomadaire */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Interventions par jour</h2>
              <TrendingUp className="text-primary" size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="day" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
                <Bar 
                  dataKey="interventions" 
                  fill="url(#gradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique de priorités */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Répartition par priorité</h2>
              <Users className="text-primary" size={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {priorityData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Résumé textuel */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-foreground mb-4">Résumé de la période</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Activité récente</h3>
              <p className="text-muted-foreground">
                {tickets.length} interventions créées au total. 
                {weeklyData.reduce((sum, day) => sum + day.interventions, 0)} nouvelles interventions cette semaine.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">Performance</h3>
              <p className="text-muted-foreground">
                Taux de résolution: {tickets.length > 0 ? Math.round((statusStats[2].value / tickets.length) * 100) : 0}%. 
                Temps de réponse moyen en amélioration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
