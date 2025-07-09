
import React, { useState } from 'react';
import { X, Send, AlertTriangle, User as UserIcon } from 'lucide-react';
import { User } from '@/data/users';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (ticket: any) => void;
}

const TicketModal = ({ isOpen, onClose, user, onSubmit }: TicketModalProps) => {
  const [formData, setFormData] = useState({
    description: '',
    comment: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    claimToService: '',
    claimToDepartment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ticket = {
      id: Date.now(),
      assignedTo: user?.name,
      assignedToEmail: user?.email,
      description: formData.description,
      comment: formData.comment,
      priority: formData.priority,
      claimToService: formData.claimToService,
      claimToDepartment: formData.claimToDepartment,
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: 'Utilisateur actuel'
    };

    onSubmit(ticket);
    setFormData({
      description: '',
      comment: '',
      priority: 'medium',
      claimToService: '',
      claimToDepartment: ''
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center">
              <UserIcon className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">Créer une intervention</h2>
              <p className="text-sm text-muted-foreground">
                Assigner à: {user?.name} ({user?.role})
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Description de la tâche *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={4}
              placeholder="Décrivez la tâche ou l'intervention nécessaire..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Commentaire
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              placeholder="Informations complémentaires, contexte..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Priorité
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="text-yellow-500" size={20} />
              <h3 className="font-semibold text-foreground">Réclamations</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Réclamation au Chef de Service
                </label>
                <textarea
                  value={formData.claimToService}
                  onChange={(e) => handleInputChange('claimToService', e.target.value)}
                  className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Décrivez votre réclamation au chef de service..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Réclamation au Chef de Département
                </label>
                <textarea
                  value={formData.claimToDepartment}
                  onChange={(e) => handleInputChange('claimToDepartment', e.target.value)}
                  className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Décrivez votre réclamation au chef de département..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 flex items-center space-x-2 hover:shadow-lg hover:shadow-primary/20"
            >
              <Send size={16} />
              <span>Enregistrer le ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;
