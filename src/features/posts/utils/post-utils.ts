import { z } from "zod";

// Schéma pour la création de post flexible
export const createPostFlexibleSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200, "Le titre ne peut pas dépasser 200 caractères"),
  content: z.string().min(1, "Le contenu est requis").max(1000, "Le contenu ne peut pas dépasser 1000 caractères"),
  postType: z.enum(["HISTOIRE", "ANECDOTE", "BON_PLAN", "LIEU_INCONTOURNABLE", "PERSONNALITE_LOCALE", "SOUVENIR", "EVENEMENT"]),
  postContext: z.enum([
    "DROLE", "AMOUR", "NOSTALGIQUE", "FAMILLE", "INSOLITE", "EMOUVANTE",
    "SURPRENANTE", "TOUCHANTE", "CURIEUSE", "RECENTE",
    "RESTAURANT", "SHOPPING", "LOISIR", "PRATIQUE", "GRATUIT",
    "INCONTOURNABLE", "CACHE", "HISTORIQUE", "NATURE", "CULTURE"
  ]).optional(),
  zone: z.enum(["MEUDON_CENTRE", "MEUDON_SUR_SEINE", "MEUDON_LA_FORET", "BELLEVUE", "VAL_FLEURY", "FORET_DOMANIALE"]).optional(),
  locationName: z.string().optional(),
  isAnonymous: z.boolean(),
  authorName: z.string().optional(),
});

export type CreatePostFlexibleInput = z.infer<typeof createPostFlexibleSchema>;

// Fonction utilitaire pour valider les données de post
export function validatePostData(input: unknown): CreatePostFlexibleInput {
  return createPostFlexibleSchema.parse(input);
}

// Fonction pour obtenir les options de contexte selon le type
export function getContextOptionsForType(postType: string) {
  switch (postType) {
    case "HISTOIRE":
      return ["DROLE", "AMOUR", "NOSTALGIQUE", "FAMILLE", "INSOLITE", "EMOUVANTE"];
    case "ANECDOTE":
      return ["DROLE", "SURPRENANTE", "TOUCHANTE", "CURIEUSE", "RECENTE"];
    case "BON_PLAN":
      return ["RESTAURANT", "SHOPPING", "LOISIR", "PRATIQUE", "GRATUIT"];
    case "LIEU_INCONTOURNABLE":
      return ["INCONTOURNABLE", "CACHE", "HISTORIQUE", "NATURE", "CULTURE"];
    default:
      return [];
  }
}

// Fonction pour formater l'affichage d'un post
export function formatPostDisplay(post: any) {
  const authorName = post.isAnonymous 
    ? (post.authorName || "Anonyme")
    : (post.user?.name || "Utilisateur");
    
  const location = post.zone 
    ? `${post.zone.replace(/_/g, "-")}${post.locationName ? ` • ${post.locationName}` : ""}`
    : post.locationName || "";
    
  return {
    ...post,
    displayAuthor: authorName,
    displayLocation: location,
    isAnonymousPost: post.isAnonymous || !post.user,
  };
}

// Constantes pour l'affichage
export const POST_TYPE_LABELS = {
  HISTOIRE: "📖 Histoire",
  ANECDOTE: "😄 Anecdote", 
  BON_PLAN: "💡 Bon plan",
  LIEU_INCONTOURNABLE: "🏛️ Lieu incontournable",
  PERSONNALITE_LOCALE: "👤 Personnalité locale",
  SOUVENIR: "💭 Souvenir",
  EVENEMENT: "📢 Événement"
};

export const ZONE_LABELS = {
  MEUDON_CENTRE: "🏘️ Meudon-Centre",
  MEUDON_SUR_SEINE: "🌊 Meudon-sur-Seine", 
  MEUDON_LA_FORET: "🌲 Meudon-la-Forêt",
  BELLEVUE: "🏛️ Bellevue",
  VAL_FLEURY: "🌿 Val-Fleury",
  FORET_DOMANIALE: "🌳 Forêt Domaniale"
};

export const POST_TYPE_ICONS = {
  HISTOIRE: "📖",
  ANECDOTE: "😄", 
  BON_PLAN: "💡",
  LIEU_INCONTOURNABLE: "🏛️",
  PERSONNALITE_LOCALE: "👤",
  SOUVENIR: "💭",
  EVENEMENT: "📢"
};

export const ZONE_ICONS = {
  MEUDON_CENTRE: "🏘️",
  MEUDON_SUR_SEINE: "🌊", 
  MEUDON_LA_FORET: "🌲",
  BELLEVUE: "🏛️",
  VAL_FLEURY: "🌿",
  FORET_DOMANIALE: "🌳"
};

export const BADGE_ICONS = {
  NOUVEAU_MEUDONNAIS: "🌱",
  HABITANT_CONFIRME: "🌿",
  PILIER_COMMUNAUTE: "🌳",
  LEGENDE_MEUDON: "🏆",
  AMI_FORET: "🌲",
  GARDIEN_PATRIMOINE: "🏛️",
  BON_VOISIN: "🤝",
  CONTEUR: "🌟",
  MEUDONNAIS_STAR: "⭐"
};
