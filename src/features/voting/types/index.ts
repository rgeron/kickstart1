export type VoteType = 'UPVOTE' | 'DOWNVOTE';

export interface Vote {
  id: string;
  userId: string;
  postId?: string;
  commentId?: string;
  type: VoteType;
  createdAt: Date;
}

export interface VoteStats {
  upvotes: number;
  downvotes: number;
  score: number; // upvotes - downvotes
  userVote?: VoteType | null;
}

export interface KarmaStats {
  totalKarma: number;
  postKarma: number;
  commentKarma: number;
  badge: KarmaBadge;
}

export type KarmaBadge = 
  | 'nouveau-meudonnais'    // 0-50 karma
  | 'habitant-confirme'     // 51-200 karma
  | 'pilier-communaute'     // 201-500 karma
  | 'legende-meudon';       // 500+ karma

export const KARMA_BADGES = {
  'nouveau-meudonnais': {
    emoji: '🌱',
    name: 'Nouveau Meudonnais',
    minKarma: 0,
    maxKarma: 50,
  },
  'habitant-confirme': {
    emoji: '🌿',
    name: 'Habitant Confirmé',
    minKarma: 51,
    maxKarma: 200,
  },
  'pilier-communaute': {
    emoji: '🌳',
    name: 'Pilier de la Communauté',
    minKarma: 201,
    maxKarma: 500,
  },
  'legende-meudon': {
    emoji: '🏆',
    name: 'Légende de Meudon',
    minKarma: 501,
    maxKarma: Infinity,
  },
} as const;
