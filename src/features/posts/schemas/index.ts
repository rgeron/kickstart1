import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10,000 characters"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;