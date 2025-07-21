
import React, { useState } from 'react';
import { 
  Ticket, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Eye,
  Edit,
  Trash2,
  UserCheck
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface TicketsPageProps {
  tickets: any[];
  onUpdateTicket?: (ticketId: number, updates: any) => void;
  onDeleteTicket?: (ticketId: number) => void;
}

const TicketsPage = ({ tickets, onUpdateTicket, onDeleteTicket }: TicketsPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [closingTicket, setClosingTicket] = useState<number | null>(null);
  const [agentName, setAgentName] = useState('');

  // Filtrer les tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return priority;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'closed': return 'Fermé';
      case 'in-progress': return 'En cours';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'closed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const handleStatusChange = (ticketId: number, newStatus: string) => {
    if (onUpdateTicket) {
      onUpdateTicket(ticketId, { status: newStatus });
    }
  };

  const handleCloseIntervention = (ticketId: number) => {
    setClosingTicket(ticketId);
    setAgentName('');
  };

  const confirmCloseIntervention = () => {
    if (closingTicket && agentName.trim() && onUpdateTicket) {
      onUpdateTicket(closingTicket, { 
        status: 'closed',
        completedBy: agentName.trim(),
        completedAt: new Date().toISOString()
      });
      setClosingTicket(null);
      setAgentName('');
    }
  };

  const cancelCloseIntervention = () => {
    setClosingTicket(null);
    setAgentName('');
  };

  return (
    <div className="mobile-optimized bg-gradient-to-br from-background via-background to-card/30 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center">
            <Ticket className="mr-3" size={32} />
            Gestion des Tickets
          </h1>
          <p className="text-muted-foreground">
            Gérez et suivez toutes les interventions du département commercial
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="glass-card mobile-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche intelligente */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Recherche intelligente de tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filtre par statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in-progress">En cours</option>
              <option value="closed">Fermé</option>
            </select>

            {/* Filtre par priorité */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Toutes les priorités</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>

            {/* Statistiques rapides */}
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                {tickets.filter(t => t.status === 'open').length} ouverts
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                {tickets.filter(t => t.status === 'closed').length} fermés
              </span>
            </div>
          </div>
        </div>

        {/* Table des tickets */}
        <div className="glass-card rounded-xl overflow-hidden">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center">
              <Ticket className="mx-auto mb-4 text-muted-foreground" size={48} />
              <h3 className="text-lg font-semibold mb-2">Aucun ticket trouvé</h3>
              <p className="text-muted-foreground">
                {tickets.length === 0 
                  ? "Aucun ticket n'a été créé pour le moment."
                  : "Aucun ticket ne correspond à vos critères de recherche."
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Assigné à</TableHead>
                  <TableHead className="font-semibold">Priorité</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold">Réalisé par</TableHead>
                  <TableHead className="font-semibold">Date création</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="border-border hover:bg-accent/50">
                    <TableCell className="font-mono text-sm">#{ticket.id}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate">{ticket.description}</p>
                        {ticket.comment && (
                          <p className="text-sm text-muted-foreground truncate">{ticket.comment}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User size={16} className="text-muted-foreground" />
                        <span className="font-medium">{ticket.assignedTo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityLabel(ticket.priority)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border cursor-pointer bg-transparent ${getStatusColor(ticket.status)}`}
                      >
                        <option value="open">Ouvert</option>
                        <option value="in-progress">En cours</option>
                        <option value="closed">Fermé</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      {ticket.completedBy ? (
                        <div className="flex items-center space-x-2">
                          <UserCheck size={16} className="text-green-500" />
                          <span className="text-sm font-medium">{ticket.completedBy}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        {ticket.status !== 'closed' && (
                          <Button
                            onClick={() => handleCloseIntervention(ticket.id)}
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Clôturer
                          </Button>
                        )}
                        {onDeleteTicket && (
                          <button
                            onClick={() => onDeleteTicket(ticket.id)}
                            className="p-1 hover:bg-destructive/20 rounded text-muted-foreground hover:text-destructive transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Modal de clôture d'intervention */}
        {closingTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelCloseIntervention} />
            <div className="relative glass-card p-6 rounded-2xl w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold gradient-text">Clôturer l'intervention</h2>
                <button
                  onClick={cancelCloseIntervention}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nom de l'agent qui a réalisé l'intervention *
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Entrez le nom de l'agent..."
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={confirmCloseIntervention}
                    disabled={!agentName.trim()}
                    className="flex-1"
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Confirmer la clôture
                  </Button>
                  <Button
                    onClick={cancelCloseIntervention}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de détails du ticket */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
            <div className="relative glass-card p-6 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold gradient-text">Détails du ticket #{selectedTicket.id}</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <p className="p-3 bg-input rounded-lg">{selectedTicket.description}</p>
                </div>

                {selectedTicket.comment && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Commentaire</label>
                    <p className="p-3 bg-input rounded-lg">{selectedTicket.comment}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Assigné à</label>
                    <p className="p-3 bg-input rounded-lg">{selectedTicket.assignedTo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priorité</label>
                    <span className={`inline-block px-3 py-2 text-sm rounded-lg border ${getPriorityColor(selectedTicket.priority)}`}>
                      {getPriorityLabel(selectedTicket.priority)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <span className={`inline-block px-3 py-2 text-sm rounded-lg border ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusLabel(selectedTicket.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date de création</label>
                    <p className="p-3 bg-input rounded-lg">
                      {new Date(selectedTicket.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>

                {selectedTicket.completedBy && (
                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-3 flex items-center text-green-600">
                      <CheckCircle className="mr-2" size={18} />
                      Intervention terminée
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Réalisé par</label>
                        <p className="p-3 bg-input rounded-lg">{selectedTicket.completedBy}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Date de clôture</label>
                        <p className="p-3 bg-input rounded-lg">
                          {new Date(selectedTicket.completedAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedTicket.claimToService || selectedTicket.claimToDepartment) && (
                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <AlertTriangle className="mr-2 text-yellow-500" size={18} />
                      Réclamations
                    </h3>
                    {selectedTicket.claimToService && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Réclamation au Chef de Service</label>
                        <p className="p-3 bg-input rounded-lg">{selectedTicket.claimToService}</p>
                      </div>
                    )}
                    {selectedTicket.claimToDepartment && (
                      <div>
                        <label className="block text-sm font-medium mb-1">Réclamation au Chef de Département</label>
                        <p className="p-3 bg-input rounded-lg">{selectedTicket.claimToDepartment}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
