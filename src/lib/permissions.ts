import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  posts: [
    "create",
    "read",
    "update",
    "delete",
    "update:own",
    "delete:own",
    "like",
    "vote",
    "comment",
  ],
  comments: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  USER: ac.newRole({
    posts: [
      "create",
      "read",
      "update:own",
      "delete:own",
      "like",
      "vote",
      "comment",
    ],
    comments: ["create", "read", "update:own", "delete:own"],
  }),

  ADMIN: ac.newRole({
    posts: [
      "create",
      "read",
      "update",
      "delete",
      "update:own",
      "delete:own",
      "like",
      "vote",
      "comment",
    ],
    comments: [
      "create",
      "read",
      "update",
      "delete",
      "update:own",
      "delete:own",
    ],
    ...adminAc.statements,
  }),
};

// Nouvelles permissions pour le système flexible
export function canUserReadContent() {
  // Tout le monde peut lire le contenu (navigation anonyme)
  return true;
}

export function canUserCreatePost(userRole?: string) {
  // Tout le monde peut créer des posts (publication anonyme)
  return true;
}

export function canUserComment(userRole?: string) {
  // Tout le monde peut commenter (commentaires anonymes)
  return true;
}

export function canUserInteract(userRole?: string) {
  // Les interactions (votes, likes) nécessitent un compte
  return userRole !== undefined;
}

export function canUserLike(userRole?: string) {
  // Les likes nécessitent un compte pour éviter les abus
  return userRole !== undefined;
}

export function canUserVote(userRole?: string) {
  // Les votes nécessitent un compte pour le système de karma
  return userRole !== undefined;
}

export function canUserManageOwnContent(isOwner: boolean, userRole?: string) {
  // Seuls les utilisateurs connectés peuvent gérer leur contenu
  return userRole !== undefined && isOwner;
}

export function canUserManageAllContent(userRole?: string) {
  return userRole === "ADMIN";
}

// Nouvelles fonctions utilitaires
export function isAnonymousUser(userRole?: string) {
  return userRole === undefined;
}

export function canUserEarnKarma(userRole?: string) {
  // Seuls les utilisateurs connectés peuvent gagner du karma
  return userRole !== undefined;
}

export function canUserReceiveMentions(userRole?: string) {
  // Seuls les utilisateurs connectés peuvent être mentionnés
  return userRole !== undefined;
}
