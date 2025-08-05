"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

/**
 * Toggle like on a post
 */
export async function likePostAction(postId: string) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Vous devez être connecté pour aimer un post",
      };
    }

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return {
        success: false,
        error: "Post non trouvé",
      };
    }

    // Check if user already liked this post
    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike the post
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Like the post
      await prisma.postLike.create({
        data: {
          userId,
          postId,
        },
      });
    }

    // Revalidate the page
    revalidatePath("/");
    revalidatePath(`/post/${postId}`);

    return {
      success: true,
      message: existingLike ? "Like retiré" : "Post aimé",
      isLiked: !existingLike,
    };
  } catch (error) {
    console.error("Erreur lors du like:", error);
    return {
      success: false,
      error: "Erreur lors du like",
    };
  }
}
