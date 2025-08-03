export type MentionType = 'USER' | 'PLACE' | 'BUSINESS';

export interface Mention {
  id: string;
  type: MentionType;
  name: string;
  displayName: string;
  slug: string; // pour les URLs
  verified?: boolean;
}

export interface UserMention extends Mention {
  type: 'USER';
  userId: string;
  karma?: number;
  badge?: string;
}

export interface PlaceMention extends Mention {
  type: 'PLACE';
  zone?: string; // zone de Meudon
  coordinates?: {
    lat: number;
    lng: number;
  };
  description?: string;
}

export interface BusinessMention extends Mention {
  type: 'BUSINESS';
  category?: string;
  zone?: string;
  address?: string;
  verified?: boolean;
}

export type MentionSuggestion = UserMention | PlaceMention | BusinessMention;

export interface MentionMatch {
  mention: MentionSuggestion;
  startIndex: number;
  endIndex: number;
  text: string;
}

export interface MentionSearchResult {
  suggestions: MentionSuggestion[];
  hasMore: boolean;
  total: number;
}
