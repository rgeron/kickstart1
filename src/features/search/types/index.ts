export type SortType = "hot" | "top" | "new" | "controversial";
export type TimeRange = "hour" | "day" | "week" | "month" | "year" | "all";

export interface SearchFilters {
  query?: string;
  tags?: string[];
  zones?: string[];
  mentions?: string[];
  authorId?: string;
  sortBy: SortType;
  timeRange?: TimeRange;
  minScore?: number;
  hasImages?: boolean;
  isAnonymous?: boolean;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface PostSearchResult {
  id: string;
  title?: string;
  content: string;
  authorName: string;
  zone?: string;
  tags: string[];
  score: number;
  commentCount: number;
  createdAt: Date;
  highlights?: {
    content?: string;
    tags?: string[];
  };
}

export interface SearchSuggestion {
  type: "TAG" | "ZONE" | "USER" | "MENTION";
  value: string;
  label: string;
  count?: number;
  emoji?: string;
}

export interface SearchHistory {
  id: string;
  userId?: string;
  query: string;
  filters: SearchFilters;
  resultCount: number;
  searchedAt: Date;
}

export interface TrendingSearch {
  query: string;
  count: number;
  growth: number; // pourcentage de croissance
  timeframe: "1h" | "24h" | "7d";
}
