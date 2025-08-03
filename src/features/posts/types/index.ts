import type { Post, User } from "@/generated/prisma";

export type PostWithUser = Post & {
  user: Pick<User, "id" | "name" | "image">;
  _count: {
    likes: number;
    votes: number;
    comments: number;
  };
};