import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  posts: ["create", "read", "update", "delete", "update:own", "delete:own", "like", "vote", "comment"],
  comments: ["create", "read", "update", "delete", "update:own", "delete:own"],
} as const;

export const ac = createAccessControl(statements);

export const roles = {
  USER: ac.newRole({
    posts: ["create", "read", "update:own", "delete:own", "like", "vote", "comment"],
    comments: ["create", "read", "update:own", "delete:own"],
  }),

  ADMIN: ac.newRole({
    posts: ["create", "read", "update", "delete", "update:own", "delete:own", "like", "vote", "comment"],
    comments: ["create", "read", "update", "delete", "update:own", "delete:own"],
    ...adminAc.statements,
  }),
};

export function canUserInteract(userRole?: string) {
  return userRole !== undefined;
}

export function canUserComment(userRole?: string) {
  return userRole !== undefined;
}

export function canUserLike(userRole?: string) {
  return userRole !== undefined;
}

export function canUserVote(userRole?: string) {
  return userRole !== undefined;
}

export function canUserCreatePost(userRole?: string) {
  return userRole !== undefined;
}

export function canUserManageOwnContent(isOwner: boolean, userRole?: string) {
  return userRole !== undefined && isOwner;
}

export function canUserManageAllContent(userRole?: string) {
  return userRole === "ADMIN";
}
