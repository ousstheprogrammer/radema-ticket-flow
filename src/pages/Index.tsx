import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import Dashboard from '@/components/Dashboard';
import TicketsPage from '@/components/TicketsPage';
import LoginPage from '@/components/LoginPage';
import SettingsPage from '@/components/SettingsPage';
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
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
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
    setCurrentPage('home');
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
          <SettingsPage 
            currentUser={currentUser}
            tickets={tickets}
            onLogout={handleLogout}
          />
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
