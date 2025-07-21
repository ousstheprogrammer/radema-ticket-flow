import React, { useState, useEffect, useRef } from 'react';
import { Search, Lightbulb, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'solution' | 'previous_ticket' | 'kb_article';
  relevanceScore: number;
}

interface SmartSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
}

// Mock knowledge base and common solutions
const knowledgeBase = [
  {
    id: 'kb-1',
    title: 'Résoudre les problèmes de connexion réseau',
    description: 'Étapes pour diagnostiquer et résoudre les problèmes de connectivité',
    category: 'solution',
    keywords: ['connexion', 'réseau', 'internet', 'wifi', 'ethernet', 'déconnexion']
  },
  {
    id: 'kb-2', 
    title: 'Réinitialiser le mot de passe utilisateur',
    description: 'Procédure pour réinitialiser le mot de passe d\'un compte utilisateur',
    category: 'solution',
    keywords: ['mot de passe', 'password', 'reset', 'oublié', 'connexion', 'login']
  },
  {
    id: 'kb-3',
    title: 'Optimiser les performances système',
    description: 'Techniques pour améliorer la vitesse et les performances du système',
    category: 'solution', 
    keywords: ['performance', 'lent', 'lenteur', 'optimisation', 'vitesse', 'ralenti']
  },
  {
    id: 'kb-4',
    title: 'Configuration des emails',
    description: 'Guide pour configurer et résoudre les problèmes d\'email',
    category: 'solution',
    keywords: ['email', 'mail', 'configuration', 'smtp', 'pop', 'imap', 'outlook']
  },
  {
    id: 'kb-5',
    title: 'Sauvegarde et récupération de données',
    description: 'Procédures de sauvegarde et de récupération des données importantes',
    category: 'solution',
    keywords: ['sauvegarde', 'backup', 'récupération', 'données', 'restauration', 'fichier']
  },
  {
    id: 'kb-6',
    title: 'Problèmes d\'impression',
    description: 'Solutions aux problèmes courants d\'imprimante et d\'impression',
    category: 'solution',
    keywords: ['impression', 'imprimante', 'imprimer', 'papier', 'toner', 'driver']
  }
];

export function SmartSearch({ value, onChange, onSuggestionSelect, placeholder = "Rechercher...", className }: SmartSearchProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Search in knowledge base
    const searchTerms = value.toLowerCase().split(' ');
    const results = knowledgeBase
      .map(item => {
        let score = 0;
        
        // Check title relevance
        searchTerms.forEach(term => {
          if (item.title.toLowerCase().includes(term)) score += 3;
          if (item.description.toLowerCase().includes(term)) score += 2;
          if (item.keywords.some(keyword => keyword.includes(term))) score += 1;
        });
        
        return {
          ...item,
          relevanceScore: score
        };
      })
      .filter(item => item.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category as 'solution' | 'previous_ticket' | 'kb_article',
        relevanceScore: item.relevanceScore
      }));

    setSuggestions(results);
    setShowSuggestions(results.length > 0);
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.title);
    setShowSuggestions(false);
    onSuggestionSelect?.(suggestion);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'solution':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      default:
        return <Search className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-b-0",
                highlightedIndex === index && "bg-accent"
              )}
            >
              <div className="flex items-start space-x-3">
                {getCategoryIcon(suggestion.category)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {suggestion.title}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {suggestion.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}