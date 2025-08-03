/**
 * Index centralisé pour toutes les features
 * Facilite les imports et maintient une API cohérente
 */

// Configuration
export * from './config';

// Posts (existant)
export * from './posts/types';
export * from './posts/schemas';

// Voting
export * from './voting/types';
export * from './voting/schemas';
export * from './voting/utils/karma-calculator';

// Comments
export * from './comments/types';
export * from './comments/utils/comment-tree';

// Mentions
export * from './mentions/types';
export * from './mentions/utils/mention-parser';

// Badges
export * from './badges/types';

// Search
export * from './search/types';
export * from './search/utils/search-parser';

// Map
export * from './map/types';

// Moderation
export * from './moderation/types';

// R2 Bucket (existant)
export * from './r2-bucket/actions';
export * from './r2-bucket/utils';

// Content (existant)
export { MEUDON_ZONES } from '../content/geolocation';
export { TAG_HIERARCHY } from '../content/tags';

// Types utilitaires communs
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserContext {
  id?: string;
  name?: string;
  role?: 'USER' | 'ADMIN';
  karma?: number;
  isAnonymous: boolean;
}

// Constantes globales
export const FEATURE_FLAGS = {
  VOTING_ENABLED: true,
  COMMENTS_ENABLED: true,
  MENTIONS_ENABLED: true,
  BADGES_ENABLED: true,
  SEARCH_ENABLED: true,
  MAP_ENABLED: true,
  MODERATION_ENABLED: true,
  REAL_TIME_ENABLED: false, // À implémenter
  NOTIFICATIONS_ENABLED: false, // À implémenter
} as const;
