import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import Dashboard from '@/components/Dashboard';
import TicketsPage from '@/components/TicketsPage';
import AuthPage from '@/components/AuthPage';
import SettingsPage from '@/components/SettingsPage';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [tickets, setTickets] = useState([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Setup Supabase auth listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Charger les tickets depuis le localStorage au démarrage
  useEffect(() => {
    const savedTickets = localStorage.getItem('srm-tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }
  }, []);

  // Sauvegarder les tickets dans le localStorage
  useEffect(() => {
    localStorage.setItem('srm-tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleAuthSuccess = () => {
    // Auth success is handled by onAuthStateChange
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erreur lors de la déconnexion');
    } else {
      setCurrentPage('home');
      toast.success('Déconnexion réussie!');
    }
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

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
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
            currentUser={user}
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
