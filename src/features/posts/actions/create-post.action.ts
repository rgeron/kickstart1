"use server";

import { auth } from "@/lib/auth/auth";
import { canUserCreatePost } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { createPostSchema, type CreatePostInput } from "../schemas";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function createPostAction(input: CreatePostInput) {
  const headersList = await headers();
  
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session?.user) {
    throw new Error("Authentication required");
  }

  if (!canUserCreatePost(session.user.role)) {
    throw new Error("Permission denied");
  }

  const validatedInput = createPostSchema.parse(input);

  try {
    await prisma.post.create({
      data: {
        title: validatedInput.title,
        content: validatedInput.content,
        userId: session.user.id,
      },
    });
  } catch (error) {
    console.error("Failed to create post:", error);
    throw new Error("Failed to create post");
  }

  redirect("/");
}