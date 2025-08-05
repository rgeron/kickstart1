"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { removeVoteSchema, voteSchema } from "../schemas";
import { VoteStats, VoteType } from "../types";

/**
 * Ajoute ou met à jour un vote
 */
export async function voteAction(input: {
  postId?: string;
  commentId?: string;
  type: VoteType;
}) {
  try {
    // Validation des données
    const validatedInput = voteSchema.parse(input);

    // Vérification de l'authentification (optionnelle pour les votes)
    const session = await auth();
    const userId = session?.user?.id;

    // Les utilisateurs anonymes ne peuvent pas voter
    if (!userId) {
      return {
        success: false,
        error: "Vous devez être connecté pour voter",
      };
    }

    const { postId, commentId, type } = validatedInput;

    // Vérifier que le post/commentaire existe
    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      });

      if (!post) {
        return {
          success: false,
          error: "Post non trouvé",
        };
      }
    }

    if (commentId) {
      const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { id: true },
      });

      if (!comment) {
        return {
          success: false,
          error: "Commentaire non trouvé",
        };
      }
    }

    // Vérifier si l'utilisateur a déjà voté
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId,
        ...(postId && { postId }),
        ...(commentId && { commentId }),
      },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        // Même vote -> le retirer
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
      } else {
        // Vote différent -> le mettre à jour
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { type },
        });
      }
    } else {
      // Nouveau vote
      await prisma.vote.create({
        data: {
          userId,
          type,
          ...(postId && { postId }),
          ...(commentId && { commentId }),
        },
      });
    }

    // Revalider les pages concernées
    if (postId) {
      revalidatePath(`/post/${postId}`);
    }
    revalidatePath("/");

    return {
      success: true,
      message: "Vote enregistré",
    };
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return {
      success: false,
      error: "Erreur lors du vote",
    };
  }
}

/**
 * Retire un vote existant
 */
export async function removeVoteAction(input: {
  postId?: string;
  commentId?: string;
}) {
  try {
    const validatedInput = removeVoteSchema.parse(input);
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Vous devez être connecté pour voter",
      };
    }

    const { postId, commentId } = validatedInput;

    // Supprimer le vote existant
    const deletedVote = await prisma.vote.deleteMany({
      where: {
        userId,
        ...(postId && { postId }),
        ...(commentId && { commentId }),
      },
    });

    if (deletedVote.count === 0) {
      return {
        success: false,
        error: "Aucun vote à supprimer",
      };
    }

    // Revalider les pages
    if (postId) {
      revalidatePath(`/post/${postId}`);
    }
    revalidatePath("/");

    return {
      success: true,
      message: "Vote retiré",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression du vote:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression du vote",
    };
  }
}

/**
 * Récupère les statistiques de vote pour un post ou commentaire
 */
export async function getVoteStats(
  postId?: string,
  commentId?: string,
  userId?: string
): Promise<VoteStats> {
  try {
    const votes = await prisma.vote.findMany({
      where: {
        ...(postId && { postId }),
        ...(commentId && { commentId }),
      },
      select: {
        type: true,
        userId: true,
      },
    });

    const upvotes = votes.filter((v) => v.type === "UPVOTE").length;
    const downvotes = votes.filter((v) => v.type === "DOWNVOTE").length;
    const score = upvotes - downvotes;

    let userVote: VoteType | null = null;
    if (userId) {
      const userVoteRecord = votes.find((v) => v.userId === userId);
      userVote = userVoteRecord?.type || null;
    }

    return {
      upvotes,
      downvotes,
      score,
      userVote,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des stats de vote:", error);
    return {
      upvotes: 0,
      downvotes: 0,
      score: 0,
      userVote: null,
    };
  }
}
