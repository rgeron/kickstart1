import { z } from 'zod';

export const voteSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
  type: z.enum(['UPVOTE', 'DOWNVOTE']),
}).refine(
  (data) => data.postId || data.commentId,
  {
    message: "Either postId or commentId must be provided",
    path: ["postId"],
  }
);

export const removeVoteSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
}).refine(
  (data) => data.postId || data.commentId,
  {
    message: "Either postId or commentId must be provided",
    path: ["postId"],
  }
);

export type VoteInput = z.infer<typeof voteSchema>;
export type RemoveVoteInput = z.infer<typeof removeVoteSchema>;
