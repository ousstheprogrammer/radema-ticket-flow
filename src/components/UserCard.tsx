
import React from 'react';
import { User, MessageSquare, Phone, Mail } from 'lucide-react';
import { User as UserType } from '@/data/users';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: UserType;
  onCreateTicket: (user: UserType) => void;
}

const UserCard = ({ user, onCreateTicket }: UserCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'busy': return 'Occupé';
      case 'offline': return 'Hors ligne';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="glass-card hover-scale p-6 rounded-xl group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user.avatar}
            </div>
            <div className={cn("absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card", getStatusColor(user.status))} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {user.name}
            </h3>
            <p className="text-sm text-muted-foreground">{user.role}</p>
          </div>
        </div>
        <span className={cn(
          "text-xs px-2 py-1 rounded-full",
          user.status === 'online' ? "bg-green-500/20 text-green-400" :
          user.status === 'busy' ? "bg-yellow-500/20 text-yellow-400" :
          "bg-gray-500/20 text-gray-400"
        )}>
          {getStatusText(user.status)}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Mail size={14} />
          <span>{user.email}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onCreateTicket(user)}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-primary/20"
        >
          <MessageSquare size={16} />
          <span>Créer un ticket</span>
        </button>
        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
          <Phone size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserCard;
