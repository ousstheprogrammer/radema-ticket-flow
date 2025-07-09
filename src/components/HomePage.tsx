
import React, { useState } from 'react';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { users } from '@/data/users';
import UserCard from './UserCard';
import TicketModal from './TicketModal';
import StatusSelectionModal from './StatusSelectionModal';
import { User } from '@/data/users';

interface HomePageProps {
  onTicketCreated: (ticket: any) => void;
  tickets: any[];
}

const HomePage = ({ onTicketCreated, tickets }: HomePageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateTicket = (user: User) => {
    setSelectedUser(user);
    setIsStatusModalOpen(true);
  };

  const handleStatusSelected = (status: 'online' | 'busy' | 'offline') => {
    setIsStatusModalOpen(false);
    setIsModalOpen(true);
  };

  const handleTicketSubmit = (ticket: any) => {
    onTicketCreated(ticket);
  };

  // Statistiques rapides
  const stats = [
    {
      icon: Users,
      label: 'Agents actifs',
      value: users.filter(u => u.status === 'online').length,
      color: 'text-green-400'
    },
    {
      icon: Clock,
      label: 'Tickets ouverts',
      value: tickets.filter(t => t.status === 'open').length,
      color: 'text-yellow-400'
    },
    {
      icon: CheckCircle,
      label: 'Tickets fermés',
      value: tickets.filter(t => t.status === 'closed').length,
      color: 'text-blue-400'
    },
    {
      icon: TrendingUp,
      label: 'Cette semaine',
      value: tickets.filter(t => {
        const ticketDate = new Date(t.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return ticketDate >= weekAgo;
      }).length,
      color: 'text-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Système de Gestion des Interventions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            RADEMA Marrakech - Département de Développement Commercial
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="glass-card hover-scale p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <Icon className={`${stat.color} w-8 h-8`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Section des agents */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Équipe Développement Commercial</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{users.filter(u => u.status === 'online').length} agents en ligne</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onCreateTicket={handleCreateTicket}
              />
            ))}
          </div>
        </div>
      </div>

      <StatusSelectionModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        user={selectedUser}
        onStatusSelected={handleStatusSelected}
      />

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSubmit={handleTicketSubmit}
      />
    </div>
  );
};

export default HomePage;
