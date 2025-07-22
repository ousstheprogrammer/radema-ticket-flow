import React, { useState, useEffect } from 'react';
import { X, User, FileText, MessageSquare, AlertTriangle, Lightbulb, Send, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as UserType } from '@/data/users';
import { SmartSearch } from '@/components/SmartSearch';
import { calculateSmartPriority, getPriorityRecommendation } from '@/utils/smartPrioritization';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
  onSubmit: (ticket: any) => void;
}

const EnhancedTicketModal = ({ isOpen, onClose, user, onSubmit }: TicketModalProps) => {
  const [description, setDescription] = useState('');
  const [comment, setComment] = useState('');
  const [priority, setPriority] = useState('medium');
  const [customerTier, setCustomerTier] = useState<'enterprise' | 'business' | 'standard'>('standard');
  const [smartRecommendation, setSmartRecommendation] = useState<any>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [claimToService, setClaimToService] = useState('');
  const [claimToDepartment, setClaimToDepartment] = useState('');
  const [problemPhase, setProblemPhase] = useState('');

  // Smart prioritization effect
  useEffect(() => {
    if (description.length > 10) {
      const recommendation = getPriorityRecommendation(description, comment, customerTier);
      setSmartRecommendation(recommendation);
      setShowRecommendation(true);
    } else {
      setShowRecommendation(false);
    }
  }, [description, comment, customerTier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (description.trim() && user) {
      // Use smart prioritization if available
      const finalPriority = smartRecommendation ? smartRecommendation.priority : priority;
      
      const ticket = {
        id: Date.now(),
        description: description.trim(),
        comment: comment.trim(),
        assignedTo: user.name,
        assignedToEmail: user.email,
        priority: finalPriority,
        status: 'open',
        createdAt: new Date().toISOString(),
        customerTier,
        smartScore: smartRecommendation?.score || 0,
        claimToService: claimToService.trim(),
        claimToDepartment: claimToDepartment.trim(),
        problemPhase: problemPhase,
        createdBy: 'Utilisateur actuel'
      };
      
      onSubmit(ticket);
      
      // Reset form
      setDescription('');
      setComment('');
      setPriority('medium');
      setCustomerTier('standard');
      setShowRecommendation(false);
      setClaimToService('');
      setClaimToDepartment('');
      setProblemPhase('');
      onClose();
    }
  };

  const handleApplySmartPriority = () => {
    if (smartRecommendation) {
      setPriority(smartRecommendation.priority);
      setShowRecommendation(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center">
              <User className="text-white" size={20} />
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
            <label className="block text-sm font-medium mb-2 flex items-center">
              <FileText className="mr-2" size={16} />
              Description du problème *
            </label>
            <SmartSearch
              value={description}
              onChange={setDescription}
              placeholder="Recherchez des solutions existantes ou décrivez le problème..."
              className="mb-2"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le problème rencontré..."
              rows={4}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <MessageSquare className="mr-2" size={16} />
              Commentaire
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Informations complémentaires, contexte..."
              rows={3}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Smart Prioritization Recommendation */}
          {showRecommendation && smartRecommendation && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 animate-slide-up">
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    Priorité recommandée: <span className="capitalize text-yellow-600 dark:text-yellow-400">{smartRecommendation.priority}</span>
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {smartRecommendation.reason}
                  </p>
                  <Button
                    type="button"
                    onClick={handleApplySmartPriority}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    Appliquer cette priorité
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Problem Phase Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center">
              <Settings className="mr-2" size={16} />
              Phase du problème *
            </label>
            <select
              value={problemPhase}
              onChange={(e) => setProblemPhase(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Sélectionnez une phase...</option>
              <option value="materiel">Problèmes matériels</option>
              <option value="logiciel">Problèmes logiciels</option>
              <option value="reseau">Problèmes réseau</option>
              <option value="compte">Comptes utilisateur / Authentification</option>
              <option value="email">Problèmes de messagerie</option>
              <option value="imprimante">Problèmes d'imprimante</option>
              <option value="acces">Accès / Permissions</option>
              <option value="performance">Performance système</option>
              <option value="application">Erreurs d'application</option>
              <option value="securite">Incidents de sécurité</option>
              <option value="paiement">Problèmes de paiement</option>
              <option value="file-attente">File d'attente / Processus</option>
              <option value="base-donnees">Base de données</option>
              <option value="sauvegarde">Sauvegarde / Restauration</option>
              <option value="telephonie">Téléphonie / Communication</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Type de client
              </label>
              <select
                value={customerTier}
                onChange={(e) => setCustomerTier(e.target.value as any)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="standard">Standard</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <AlertTriangle className="mr-2" size={16} />
                Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
            </div>
          </div>

          {/* Complaints Section */}
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
                  value={claimToService}
                  onChange={(e) => setClaimToService(e.target.value)}
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
                  value={claimToDepartment}
                  onChange={(e) => setClaimToDepartment(e.target.value)}
                  className="w-full p-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Décrivez votre réclamation au chef de département..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="mobile-button"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="mobile-button flex items-center space-x-2"
            >
              <Send size={16} />
              <span>Créer le ticket</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedTicketModal;