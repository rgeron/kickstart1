"use server";

import type { PostSearchParams } from "@/lib/post-filters";
import { buildPostsQuery, type PostWithRelations } from "@/lib/post-filters";
import { prisma } from "@/lib/prisma";

export interface GetPostsResult {
  posts: PostWithRelations[];
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export async function getPostsAction(
  params: PostSearchParams & { pageSize?: number } = {}
): Promise<GetPostsResult> {
  try {
    const { page = 1, pageSize = 10, ...searchParams } = params;

    // Build the query based on search parameters
    const { where, orderBy } = buildPostsQuery(searchParams);

    // Calculate pagination
    const skip = (page - 1) * pageSize;

    // Get total count for pagination
    const totalCount = await prisma.post.count({ where });

    // Fetch posts with relations
    const posts = await prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
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

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      posts: posts as PostWithRelations[],
      totalCount,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

// Action for getting posts with search (can be used in Server Components)
export async function searchPostsAction(searchParams: PostSearchParams) {
  return getPostsAction(searchParams);
}

// Action for getting user's own posts with search
export async function getUserPostsAction(
  userId: string,
  params: PostSearchParams & { pageSize?: number } = {}
) {
  try {
    const searchParamsWithUser = {
      ...params,
      // Add user filter to the existing search params
    };

    const { where, orderBy } = buildPostsQuery(searchParamsWithUser);

    // Add user filter to where clause
    const userWhere = {
      ...where,
      userId,
    };

    const { page = 1, pageSize = 10 } = params;

    const skip = (page - 1) * pageSize;
    const totalCount = await prisma.post.count({ where: userWhere });

    const posts = await prisma.post.findMany({
      where: userWhere,
      orderBy,
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        votes: {
          select: {
            type: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
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

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      posts: posts as PostWithRelations[],
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw new Error("Failed to fetch user posts");
  }
}
