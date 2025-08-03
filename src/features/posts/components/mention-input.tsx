"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, MapPin, Store } from "lucide-react";

// Types pour les suggestions de mentions
interface MentionSuggestion {
  id: string;
  type: "USER" | "LIEU" | "COMMERCE";
  text: string; // @Pierre_Durand, @MuseeRodin, @BoulangerieCentre
  displayName: string; // Pierre Durand, Musée Rodin, Boulangerie du Centre
  description?: string;
  icon: React.ReactNode;
}

// Données de test pour les suggestions
const MOCK_SUGGESTIONS: MentionSuggestion[] = [
  // Utilisateurs
  {
    id: "user-1",
    type: "USER",
    text: "@Pierre_Durand",
    displayName: "Pierre Durand",
    description: "Habitant de Meudon-Centre",
    icon: <User className="h-4 w-4 text-blue-500" />
  },
  {
    id: "user-2", 
    type: "USER",
    text: "@Marie_Martin",
    displayName: "Marie Martin",
    description: "Pilier de la communauté",
    icon: <User className="h-4 w-4 text-blue-500" />
  },
  
  // Lieux
  {
    id: "lieu-1",
    type: "LIEU",
    text: "@MuseeRodin",
    displayName: "Musée Rodin",
    description: "Bellevue • Monument historique",
    icon: <MapPin className="h-4 w-4 text-green-500" />
  },
  {
    id: "lieu-2",
    type: "LIEU", 
    text: "@ForetMeudon",
    displayName: "Forêt de Meudon",
    description: "Forêt Domaniale • Nature",
    icon: <MapPin className="h-4 w-4 text-green-500" />
  },
  {
    id: "lieu-3",
    type: "LIEU",
    text: "@ObservatoireMeudon", 
    displayName: "Observatoire de Meudon",
    description: "Meudon-Centre • Science",
    icon: <MapPin className="h-4 w-4 text-green-500" />
  },
  
  // Commerces
  {
    id: "commerce-1",
    type: "COMMERCE",
    text: "@BoulangerieCentre",
    displayName: "Boulangerie du Centre", 
    description: "Meudon-Centre • Boulangerie",
    icon: <Store className="h-4 w-4 text-orange-500" />
  },
  {
    id: "commerce-2",
    type: "COMMERCE",
    text: "@PharmacieGare",
    displayName: "Pharmacie de la Gare",
    description: "Val-Fleury • Pharmacie", 
    icon: <Store className="h-4 w-4 text-orange-500" />
  }
];

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  onMentionAdd?: (mention: MentionSuggestion) => void;
}

export function MentionInput({
  value,
  onChange,
  placeholder = "Écrivez votre message... Utilisez @ pour mentionner",
  rows = 4,
  className,
  onMentionAdd
}: MentionInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Détecter les mentions @ dans le texte
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    
    // Chercher le dernier @ avant le curseur
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    
    if (lastAtIndex === -1) {
      setShowSuggestions(false);
      return;
    }
    
    // Vérifier qu'il n'y a pas d'espace après le @
    const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
    if (textAfterAt.includes(" ") || textAfterAt.includes("\n")) {
      setShowSuggestions(false);
      return;
    }
    
    // Extraire la requête de mention
    const query = textAfterAt.toLowerCase();
    setMentionQuery(query);
    setMentionStart(lastAtIndex);
    
    // Filtrer les suggestions
    const filteredSuggestions = MOCK_SUGGESTIONS.filter(suggestion =>
      suggestion.text.toLowerCase().includes(query) ||
      suggestion.displayName.toLowerCase().includes(query)
    );
    
    setSuggestions(filteredSuggestions);
    setSelectedIndex(0);
    setShowSuggestions(filteredSuggestions.length > 0);
  }, [value]);

  // Gérer les touches du clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
        
      case "Enter":
      case "Tab":
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          insertMention(suggestions[selectedIndex]);
        }
        break;
        
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  // Insérer une mention dans le texte
  const insertMention = (suggestion: MentionSuggestion) => {
    const beforeMention = value.substring(0, mentionStart);
    const afterCursor = value.substring(textareaRef.current?.selectionStart || 0);
    
    const newValue = beforeMention + suggestion.text + " " + afterCursor;
    onChange(newValue);
    
    setShowSuggestions(false);
    onMentionAdd?.(suggestion);
    
    // Repositionner le curseur
    setTimeout(() => {
      const newCursorPosition = beforeMention.length + suggestion.text.length + 1;
      textareaRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={className}
      />
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card 
          ref={suggestionsRef}
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto border shadow-lg"
        >
          <div className="p-1">
            {suggestions.map((suggestion, index) => (
              <Button
                key={suggestion.id}
                variant={index === selectedIndex ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3 text-left"
                onClick={() => insertMention(suggestion)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-shrink-0">
                    {suggestion.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">
                      {suggestion.text}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {suggestion.displayName}
                      {suggestion.description && ` • ${suggestion.description}`}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs px-2 py-1 bg-muted rounded">
                      {suggestion.type === "USER" ? "Utilisateur" : 
                       suggestion.type === "LIEU" ? "Lieu" : "Commerce"}
                    </span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      )}
      
      {/* Aide contextuelle */}
      <div className="mt-2 text-xs text-muted-foreground">
        💡 Tapez @ pour mentionner des utilisateurs, lieux ou commerces de Meudon
      </div>
    </div>
  );
}
