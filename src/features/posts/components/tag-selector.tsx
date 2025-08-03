"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag, X } from "lucide-react";
import { useState } from "react";

// Database enum values (matching Prisma schema)
type PostType =
  | "HISTOIRE"
  | "ANECDOTE"
  | "BON_PLAN"
  | "LIEU_INCONTOURNABLE"
  | "PERSONNALITE_LOCALE"
  | "SOUVENIR"
  | "EVENEMENT";
type PostContext =
  | "DROLE"
  | "AMOUR"
  | "NOSTALGIQUE"
  | "FAMILLE"
  | "INSOLITE"
  | "EMOUVANTE"
  | "SURPRENANTE"
  | "TOUCHANTE"
  | "CURIEUSE"
  | "RECENTE"
  | "RESTAURANT"
  | "SHOPPING"
  | "LOISIR"
  | "PRATIQUE"
  | "GRATUIT"
  | "INCONTOURNABLE"
  | "CACHE"
  | "HISTORIQUE"
  | "NATURE"
  | "CULTURE";

// Configuration for display
const POST_TYPE_CONFIG = {
  HISTOIRE: {
    emoji: "📖",
    label: "Histoire",
    contexts: [
      "DROLE",
      "AMOUR",
      "NOSTALGIQUE",
      "FAMILLE",
      "INSOLITE",
      "EMOUVANTE",
    ] as PostContext[],
  },
  ANECDOTE: {
    emoji: "😄",
    label: "Anecdote",
    contexts: [
      "DROLE",
      "SURPRENANTE",
      "TOUCHANTE",
      "CURIEUSE",
      "RECENTE",
    ] as PostContext[],
  },
  BON_PLAN: {
    emoji: "💡",
    label: "Bon plan",
    contexts: [
      "RESTAURANT",
      "SHOPPING",
      "LOISIR",
      "PRATIQUE",
      "GRATUIT",
    ] as PostContext[],
  },
  LIEU_INCONTOURNABLE: {
    emoji: "🏛️",
    label: "Lieu incontournable",
    contexts: [
      "INCONTOURNABLE",
      "CACHE",
      "HISTORIQUE",
      "NATURE",
      "CULTURE",
    ] as PostContext[],
  },
  PERSONNALITE_LOCALE: {
    emoji: "👤",
    label: "Personnalité locale",
    contexts: ["HISTORIQUE", "CULTURE"] as PostContext[],
  },
  SOUVENIR: {
    emoji: "💭",
    label: "Souvenir",
    contexts: ["NOSTALGIQUE", "FAMILLE", "EMOUVANTE"] as PostContext[],
  },
  EVENEMENT: {
    emoji: "📢",
    label: "Événement",
    contexts: ["CULTURE", "HISTORIQUE"] as PostContext[],
  },
} as const;

const CONTEXT_LABELS: Record<PostContext, string> = {
  DROLE: "Drôle",
  AMOUR: "Amour",
  NOSTALGIQUE: "Nostalgique",
  FAMILLE: "Famille",
  INSOLITE: "Insolite",
  EMOUVANTE: "Émouvante",
  SURPRENANTE: "Surprenante",
  TOUCHANTE: "Touchante",
  CURIEUSE: "Curieuse",
  RECENTE: "Récente",
  RESTAURANT: "Restaurant",
  SHOPPING: "Shopping",
  LOISIR: "Loisir",
  PRATIQUE: "Pratique",
  GRATUIT: "Gratuit",
  INCONTOURNABLE: "Incontournable",
  CACHE: "Caché",
  HISTORIQUE: "Historique",
  NATURE: "Nature",
  CULTURE: "Culture",
};

interface TagSelectorProps {
  selectedType?: PostType;
  selectedContext?: PostContext;
  onTypeChange: (type: PostType) => void;
  onContextChange: (context: PostContext | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function TagSelector({
  selectedType,
  selectedContext,
  onTypeChange,
  onContextChange,
  disabled = false,
  className,
}: TagSelectorProps) {
  const availableContexts = selectedType
    ? POST_TYPE_CONFIG[selectedType].contexts
    : [];

  const handleTypeSelect = (type: PostType) => {
    onTypeChange(type);
    onContextChange(undefined); // Reset context when type changes
  };

  const clearContext = () => {
    onContextChange(undefined);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Type Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Type de post</Label>
        <Select
          value={selectedType}
          onValueChange={handleTypeSelect}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir un type..." />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(POST_TYPE_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.emoji}</span>
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Context Selection */}
      {selectedType && availableContexts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Contexte (optionnel)</Label>
            {selectedContext && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearContext}
                disabled={disabled}
                className="h-6 px-2 text-xs"
              >
                <X className="h-3 w-3" />
                Effacer
              </Button>
            )}
          </div>

          {/* Context Grid */}
          <div className="grid grid-cols-2 gap-2">
            {availableContexts.map((context) => (
              <Button
                key={context}
                type="button"
                variant={selectedContext === context ? "default" : "outline"}
                size="sm"
                onClick={() => onContextChange(context)}
                disabled={disabled}
                className="justify-start text-xs h-8"
              >
                {CONTEXT_LABELS[context]}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Tags Display */}
      {(selectedType || selectedContext) && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Tags sélectionnés</Label>
          <div className="flex flex-wrap gap-2">
            {selectedType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <span>{POST_TYPE_CONFIG[selectedType].emoji}</span>
                <span>{POST_TYPE_CONFIG[selectedType].label}</span>
              </Badge>
            )}
            {selectedContext && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{CONTEXT_LABELS[selectedContext]}</span>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for use in forms
interface CompactTagSelectorProps {
  selectedType?: PostType;
  selectedContext?: PostContext;
  onTypeChange: (type: PostType) => void;
  onContextChange: (context: PostContext | undefined) => void;
  disabled?: boolean;
}

export function CompactTagSelector({
  selectedType,
  selectedContext,
  onTypeChange,
  onContextChange,
  disabled = false,
}: CompactTagSelectorProps) {
  const availableContexts = selectedType
    ? POST_TYPE_CONFIG[selectedType].contexts
    : [];

  return (
    <div className="space-y-3">
      {/* Type Selection */}
      <Select
        value={selectedType}
        onValueChange={(value) => {
          onTypeChange(value as PostType);
          onContextChange(undefined);
        }}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Type de post..." />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(POST_TYPE_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              <div className="flex items-center gap-2">
                <span>{config.emoji}</span>
                <span>{config.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Context Selection */}
      {selectedType && availableContexts.length > 0 && (
        <Select
          value={selectedContext || "none"}
          onValueChange={(value) =>
            onContextChange(
              value === "none" ? undefined : (value as PostContext)
            )
          }
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Contexte (optionnel)..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Aucun contexte</SelectItem>
            {availableContexts.map((context) => (
              <SelectItem key={context} value={context}>
                {CONTEXT_LABELS[context]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Preview */}
      {selectedType && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Aperçu:</span>
          <Badge variant="secondary" className="text-xs">
            {POST_TYPE_CONFIG[selectedType].emoji}{" "}
            {POST_TYPE_CONFIG[selectedType].label}
          </Badge>
          {selectedContext && (
            <Badge variant="outline" className="text-xs">
              {CONTEXT_LABELS[selectedContext]}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for managing tag state
export function useTagSelector(
  initialType?: PostType,
  initialContext?: PostContext
) {
  const [selectedType, setSelectedType] = useState<PostType | undefined>(
    initialType
  );
  const [selectedContext, setSelectedContext] = useState<
    PostContext | undefined
  >(initialContext);

  const handleTypeChange = (type: PostType) => {
    setSelectedType(type);
    setSelectedContext(undefined); // Reset context when type changes
  };

  const handleContextChange = (context: PostContext | undefined) => {
    setSelectedContext(context);
  };

  const reset = () => {
    setSelectedType(undefined);
    setSelectedContext(undefined);
  };

  return {
    selectedType,
    selectedContext,
    handleTypeChange,
    handleContextChange,
    reset,
    isValid: !!selectedType,
  };
}
