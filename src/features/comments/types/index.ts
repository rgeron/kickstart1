export interface Comment {
  id: string;
  content: string;
  authorId: string | null; // null pour anonyme
  authorName: string; // "Anonyme" ou nom utilisateur
  postId: string;
  parentId: string | null; // null pour commentaire racine
  depth: number; // profondeur dans l'arbre (0 = racine)
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  author?: {
    id: string;
    name: string;
    karma?: number;
  } | null;
  children?: Comment[];
  parent?: Comment | null;
  
  // Stats de vote
  upvotes: number;
  downvotes: number;
  score: number;
  userVote?: 'UPVOTE' | 'DOWNVOTE' | null;
  
  // État UI
  isCollapsed?: boolean;
  isHighlighted?: boolean;
}

export interface CommentTree {
  comment: Comment;
  children: CommentTree[];
  totalReplies: number;
}

export type CommentSortType = 'best' | 'top' | 'new' | 'controversial' | 'old';

export interface CommentFilters {
  sortBy: CommentSortType;
  showCollapsed: boolean;
  minScore?: number;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  parentId?: string;
  authorName?: string; // Pour les utilisateurs anonymes
}

export interface UpdateCommentInput {
  id: string;
  content: string;
}
