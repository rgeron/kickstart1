"use server";

import { auth } from "@/lib/auth/auth";
import { canUserCreatePost } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  createPostFlexibleSchema,
  type CreatePostFlexibleInput,
} from "../utils/post-utils";

export async function createPostFlexibleAction(input: CreatePostFlexibleInput) {
  const headersList = await headers();

  // Récupérer la session (peut être null pour les utilisateurs anonymes)
  const session = await auth.api.getSession({
    headers: headersList,
  });

  // Vérifier les permissions (maintenant ouvert à tous)
  if (!canUserCreatePost(session?.user?.role)) {
    throw new Error("Permission denied");
  }

  // Valider les données d'entrée
  const validatedInput = createPostFlexibleSchema.parse(input);

  try {
    // Préparer les données du post
    const postData: any = {
      title: validatedInput.title,
      content: validatedInput.content,
      postType: validatedInput.postType,
      postContext: validatedInput.postContext,
      zone: validatedInput.zone,
      locationName: validatedInput.locationName,
      isAnonymous: validatedInput.isAnonymous,
    };

    // Gestion de l'auteur
    if (validatedInput.isAnonymous || !session?.user) {
      // Post anonyme
      postData.isAnonymous = true;
      postData.authorName = validatedInput.authorName || "Anonyme";
      postData.userId = null; // Pas d'utilisateur associé
    } else {
      // Post d'utilisateur connecté
      postData.isAnonymous = false;
      postData.userId = session.user.id;
      postData.authorName = null; // Le nom viendra de la relation user
    }

    // Créer le post
    const newPost = await prisma.post.create({
      data: postData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            votes: true,
            comments: true,
          },
        },
      },
    });

    console.log("Post créé avec succès:", newPost.id);
  } catch (error) {
    console.error("Failed to create post:", error);

    // Gestion des erreurs spécifiques
    if (error instanceof z.ZodError) {
      throw new Error(
        `Données invalides: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }

    throw new Error("Failed to create post");
  }

  // Rediriger vers la page d'accueil
  redirect("/");
}
