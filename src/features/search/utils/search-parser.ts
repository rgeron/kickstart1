import { SearchFilters } from '../types';

/**
 * Parse une requête de recherche avancée avec syntaxe spéciale
 * Exemples :
 * - "histoire drôle" -> recherche simple
 * - "tag:histoire zone:centre" -> filtres spécifiques
 * - "@MuseeRodin histoire" -> mention + mot-clé
 * - "score:>10 tag:bon-plan" -> score minimum + tag
 */
export function parseSearchQuery(query: string): {
  cleanQuery: string;
  filters: Partial<SearchFilters>;
} {
  const filters: Partial<SearchFilters> = {};
  let cleanQuery = query;

  // Extraire les filtres spéciaux
  const filterPatterns = [
    { pattern: /tag:([^\s]+)/g, key: 'tags' },
    { pattern: /zone:([^\s]+)/g, key: 'zones' },
    { pattern: /@([^\s]+)/g, key: 'mentions' },
    { pattern: /author:([^\s]+)/g, key: 'authorId' },
    { pattern: /score:>(\d+)/g, key: 'minScore' },
    { pattern: /sort:([^\s]+)/g, key: 'sortBy' },
    { pattern: /time:([^\s]+)/g, key: 'timeRange' },
    { pattern: /images:(true|false)/g, key: 'hasImages' },
    { pattern: /anon:(true|false)/g, key: 'isAnonymous' },
  ];

  filterPatterns.forEach(({ pattern, key }) => {
    let match;
    const values: string[] = [];
    
    while ((match = pattern.exec(query)) !== null) {
      const value = match[1];
      
      // Traitement spécial selon le type de filtre
      switch (key) {
        case 'tags':
        case 'zones':
        case 'mentions':
          values.push(value);
          break;
        case 'minScore':
          filters[key] = parseInt(value, 10);
          break;
        case 'hasImages':
        case 'isAnonymous':
          filters[key] = value === 'true';
          break;
        case 'sortBy':
          if (['hot', 'top', 'new', 'controversial'].includes(value)) {
            filters[key] = value as any;
          }
          break;
        case 'timeRange':
          if (['hour', 'day', 'week', 'month', 'year', 'all'].includes(value)) {
            filters[key] = value as any;
          }
          break;
        default:
          filters[key] = value;
      }
      
      // Supprimer le filtre de la requête
      cleanQuery = cleanQuery.replace(match[0], '').trim();
    }
    
    if (values.length > 0) {
      filters[key] = values;
    }
    
    // Reset regex pour éviter les problèmes de state
    pattern.lastIndex = 0;
  });

  // Nettoyer les espaces multiples
  cleanQuery = cleanQuery.replace(/\s+/g, ' ').trim();

  return { cleanQuery, filters };
}

/**
 * Génère des suggestions de recherche basées sur l'input utilisateur
 */
export function generateSearchSuggestions(
  input: string,
  availableTags: string[],
  availableZones: string[],
  recentSearches: string[]
): string[] {
  const suggestions: string[] = [];
  const lowerInput = input.toLowerCase();

  // Suggestions basées sur les recherches récentes
  recentSearches
    .filter(search => search.toLowerCase().includes(lowerInput))
    .slice(0, 3)
    .forEach(search => suggestions.push(search));

  // Suggestions de tags
  availableTags
    .filter(tag => tag.toLowerCase().includes(lowerInput))
    .slice(0, 5)
    .forEach(tag => suggestions.push(`tag:${tag}`));

  // Suggestions de zones
  availableZones
    .filter(zone => zone.toLowerCase().includes(lowerInput))
    .slice(0, 3)
    .forEach(zone => suggestions.push(`zone:${zone}`));

  // Suggestions de syntaxe avancée
  if (lowerInput.includes('score')) {
    suggestions.push('score:>10', 'score:>50');
  }
  
  if (lowerInput.includes('sort')) {
    suggestions.push('sort:hot', 'sort:top', 'sort:new');
  }

  // Limiter le nombre total de suggestions
  return [...new Set(suggestions)].slice(0, 10);
}

/**
 * Construit une requête de recherche à partir des filtres
 */
export function buildSearchQuery(filters: SearchFilters, baseQuery?: string): string {
  const parts: string[] = [];
  
  if (baseQuery?.trim()) {
    parts.push(baseQuery.trim());
  }

  if (filters.tags?.length) {
    filters.tags.forEach(tag => parts.push(`tag:${tag}`));
  }

  if (filters.zones?.length) {
    filters.zones.forEach(zone => parts.push(`zone:${zone}`));
  }

  if (filters.mentions?.length) {
    filters.mentions.forEach(mention => parts.push(`@${mention}`));
  }

  if (filters.authorId) {
    parts.push(`author:${filters.authorId}`);
  }

  if (filters.minScore !== undefined) {
    parts.push(`score:>${filters.minScore}`);
  }

  if (filters.sortBy && filters.sortBy !== 'hot') {
    parts.push(`sort:${filters.sortBy}`);
  }

  if (filters.timeRange && filters.timeRange !== 'all') {
    parts.push(`time:${filters.timeRange}`);
  }

  if (filters.hasImages !== undefined) {
    parts.push(`images:${filters.hasImages}`);
  }

  if (filters.isAnonymous !== undefined) {
    parts.push(`anon:${filters.isAnonymous}`);
  }

  return parts.join(' ');
}

/**
 * Valide les filtres de recherche
 */
export function validateSearchFilters(filters: Partial<SearchFilters>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (filters.minScore !== undefined && (filters.minScore < 0 || filters.minScore > 10000)) {
    errors.push('Le score minimum doit être entre 0 et 10000');
  }

  if (filters.tags && filters.tags.length > 10) {
    errors.push('Maximum 10 tags autorisés');
  }

  if (filters.zones && filters.zones.length > 6) {
    errors.push('Maximum 6 zones autorisées');
  }

  if (filters.query && filters.query.length > 500) {
    errors.push('La requête ne peut pas dépasser 500 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
