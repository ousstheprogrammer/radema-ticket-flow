
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import Dashboard from '@/components/Dashboard';
import TicketsPage from '@/components/TicketsPage';
import LoginPage from '@/components/LoginPage';
import { toast } from 'sonner';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [tickets, setTickets] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('radema-user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Charger les tickets depuis le localStorage au démarrage
  useEffect(() => {
    const savedTickets = localStorage.getItem('radema-tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Sauvegarder les tickets dans le localStorage
  useEffect(() => {
    localStorage.setItem('radema-tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleLogin = (username: string, password: string) => {
    // Simulation d'une authentification simple
    const user = {
      username,
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('radema-user', JSON.stringify(user));
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    toast.success('Connexion réussie!', {
      description: `Bienvenue ${username}`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('radema-user');
    setCurrentUser(null);
    setIsLoggedIn(false);
    toast.success('Déconnexion réussie!');
  };

  const handleTicketCreated = (ticket) => {
    setTickets(prev => [...prev, ticket]);
    toast.success('Intervention créée avec succès!', {
      description: `Assignée à ${ticket.assignedTo}`,
    });
  };

  const handleUpdateTicket = (ticketId, updates) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, ...updates } : ticket
    ));
    toast.success('Ticket mis à jour avec succès!');
  };

  const handleDeleteTicket = (ticketId) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
    toast.success('Ticket supprimé avec succès!');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onTicketCreated={handleTicketCreated}
            tickets={tickets}
          />
        );
      case 'dashboard':
        return <Dashboard tickets={tickets} />;
      case 'tickets':
        return (
          <TicketsPage 
            tickets={tickets}
            onUpdateTicket={handleUpdateTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        );
      case 'settings':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 pt-20 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold gradient-text mb-8">Paramètres</h1>
              <div className="glass-card p-6 rounded-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Utilisateur connecté</p>
                      <p className="text-sm text-muted-foreground">{currentUser?.username}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <HomePage onTicketCreated={handleTicketCreated} tickets={tickets} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderCurrentPage()}
    </div>
  );
};

export default Index;
