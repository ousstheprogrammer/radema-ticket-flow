
import React, { useState } from 'react';
import { User, Lock, LogIn } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      onLogin(formData.username, formData.password);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/30 flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">
            Connexion SRM
          </h1>
          <p className="text-muted-foreground">
            Département de Développement Commercial
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-primary/20"
          >
            <LogIn size={20} />
            <span>Se connecter</span>
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Système de Gestion des Interventions</p>
          <p>SRM Marrakech</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
