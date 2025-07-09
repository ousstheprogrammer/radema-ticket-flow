
import React, { useState } from 'react';
import { X, User as UserIcon, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { User } from '@/data/users';

interface StatusSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onStatusSelected: (status: 'online' | 'busy' | 'offline') => void;
}

const StatusSelectionModal = ({ isOpen, onClose, user, onStatusSelected }: StatusSelectionModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<'online' | 'busy' | 'offline'>('online');

  const handleConfirm = () => {
    onStatusSelected(selectedStatus);
    onClose();
  };

  const statusOptions = [
    {
      value: 'online' as const,
      label: 'En ligne',
      description: 'Disponible pour les interventions',
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      value: 'busy' as const,
      label: 'Occupé',
      description: 'Occupé mais peut recevoir des interventions urgentes',
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      value: 'offline' as const,
      label: 'Hors ligne',
      description: 'Non disponible pour les interventions',
      icon: AlertCircle,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 rounded-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center">
              <UserIcon className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">Statut de disponibilité</h2>
              <p className="text-sm text-muted-foreground">
                {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-muted-foreground mb-4">
            Sélectionnez votre statut actuel avant de créer une intervention :
          </p>
          
          {statusOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.value}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStatus === option.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedStatus(option.value)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${option.bgColor}`}>
                    <Icon className={option.color} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{option.label}</span>
                      {selectedStatus === option.value && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusSelectionModal;
