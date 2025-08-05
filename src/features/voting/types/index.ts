export type VoteType = "UPVOTE" | "DOWNVOTE";

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
