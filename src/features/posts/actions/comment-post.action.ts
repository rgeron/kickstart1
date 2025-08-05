"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

const commentSchema = z.object({
  postId: z.string().min(1, "Post ID requis"),
  content: z
    .string()
    .min(1, "Le contenu est requis")
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères"),
  parentId: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;

/**
 * Create a comment on a post
 */
export async function commentPostAction(input: CommentInput) {
  try {
    const validatedInput = commentSchema.parse(input);
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Vous devez être connecté pour commenter",
      };
    }

    const { postId, content, parentId } = validatedInput;

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

    // If parentId is provided, check if the parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment) {
        return {
          success: false,
          error: "Commentaire parent non trouvé",
        };
      }

      // Ensure the parent comment belongs to the same post
      if (parentComment.postId !== postId) {
        return {
          success: false,
          error: "Le commentaire parent n'appartient pas à ce post",
        };
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        userId,
        parentId: parentId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // Revalidate the page
    revalidatePath("/");
    revalidatePath(`/post/${postId}`);

    return {
      success: true,
      message: "Commentaire ajouté",
      comment,
    };
  } catch (error) {
    console.error("Erreur lors de la création du commentaire:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      error: "Erreur lors de la création du commentaire",
    };
  }
}
