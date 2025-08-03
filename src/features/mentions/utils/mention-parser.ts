import { MentionMatch, MentionSuggestion } from '../types';

/**
 * Expression régulière pour détecter les mentions @
 */
const MENTION_REGEX = /@([a-zA-Z0-9_-]+)/g;

/**
 * Parse le texte pour extraire toutes les mentions
 */
export function parseMentions(text: string): MentionMatch[] {
  const matches: MentionMatch[] = [];
  let match;

  // Reset regex pour éviter les problèmes de state
  MENTION_REGEX.lastIndex = 0;

  while ((match = MENTION_REGEX.exec(text)) !== null) {
    matches.push({
      mention: {
        id: '', // Sera rempli lors de la résolution
        type: 'USER', // Type par défaut, sera déterminé lors de la résolution
        name: match[1],
        displayName: match[1],
        slug: match[1],
      } as MentionSuggestion,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      text: match[0],
    });
  }

  return matches;
}

/**
 * Remplace les mentions dans le texte par des liens HTML
 */
export function renderMentionsAsHTML(
  text: string, 
  resolvedMentions: MentionMatch[]
): string {
  let result = text;
  
  // Trier par index décroissant pour éviter les décalages lors du remplacement
  const sortedMentions = [...resolvedMentions].sort((a, b) => b.startIndex - a.startIndex);
  
  sortedMentions.forEach(match => {
    const { mention, startIndex, endIndex } = match;
    const before = result.substring(0, startIndex);
    const after = result.substring(endIndex);
    
    let linkHTML = '';
    switch (mention.type) {
      case 'USER':
        linkHTML = `<a href="/user/${mention.slug}" class="mention mention-user">@${mention.displayName}</a>`;
        break;
      case 'PLACE':
        linkHTML = `<a href="/place/${mention.slug}" class="mention mention-place">@${mention.displayName}</a>`;
        break;
      case 'BUSINESS':
        linkHTML = `<a href="/business/${mention.slug}" class="mention mention-business">@${mention.displayName}</a>`;
        break;
    }
    
    result = before + linkHTML + after;
  });
  
  return result;
}

/**
 * Extrait le texte de recherche actuel pour l'autocomplétion
 */
export function extractCurrentMention(text: string, cursorPosition: number): {
  query: string;
  startIndex: number;
  endIndex: number;
} | null {
  // Chercher le @ le plus proche avant le curseur
  let atIndex = -1;
  for (let i = cursorPosition - 1; i >= 0; i--) {
    if (text[i] === '@') {
      atIndex = i;
      break;
    }
    // Si on trouve un espace, on arrête la recherche
    if (text[i] === ' ' || text[i] === '\n') {
      break;
    }
  }
  
  if (atIndex === -1) return null;
  
  // Extraire le texte après le @
  let endIndex = cursorPosition;
  for (let i = atIndex + 1; i < text.length; i++) {
    if (text[i] === ' ' || text[i] === '\n' || text[i] === '@') {
      endIndex = i;
      break;
    }
    if (i === text.length - 1) {
      endIndex = text.length;
    }
  }
  
  const query = text.substring(atIndex + 1, endIndex);
  
  return {
    query,
    startIndex: atIndex,
    endIndex,
  };
}

/**
 * Remplace la mention en cours de saisie par la suggestion sélectionnée
 */
export function replaceMention(
  text: string,
  startIndex: number,
  endIndex: number,
  suggestion: MentionSuggestion
): {
  newText: string;
  newCursorPosition: number;
} {
  const before = text.substring(0, startIndex);
  const after = text.substring(endIndex);
  const mentionText = `@${suggestion.displayName}`;
  
  const newText = before + mentionText + after;
  const newCursorPosition = startIndex + mentionText.length;
  
  return {
    newText,
    newCursorPosition,
  };
}

/**
 * Filtre les suggestions basées sur la requête
 */
export function filterSuggestions(
  suggestions: MentionSuggestion[],
  query: string,
  limit: number = 10
): MentionSuggestion[] {
  if (!query) return suggestions.slice(0, limit);
  
  const lowerQuery = query.toLowerCase();
  
  return suggestions
    .filter(suggestion => 
      suggestion.name.toLowerCase().includes(lowerQuery) ||
      suggestion.displayName.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => {
      // Priorité aux correspondances exactes au début
      const aStartsWithQuery = a.name.toLowerCase().startsWith(lowerQuery);
      const bStartsWithQuery = b.name.toLowerCase().startsWith(lowerQuery);
      
      if (aStartsWithQuery && !bStartsWithQuery) return -1;
      if (!aStartsWithQuery && bStartsWithQuery) return 1;
      
      // Ensuite par type (utilisateurs d'abord)
      if (a.type !== b.type) {
        const typeOrder = { USER: 0, PLACE: 1, BUSINESS: 2 };
        return typeOrder[a.type] - typeOrder[b.type];
      }
      
      // Enfin par nom
      return a.displayName.localeCompare(b.displayName);
    })
    .slice(0, limit);
}
