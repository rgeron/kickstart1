"use server";

import type { PostSearchParams, PostWithRelations } from "@/lib/post-filters";
import { buildPostsQuery } from "@/lib/post-filters";
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
    console.log("Starting getPostsAction with params:", params);
    
    // Test database connection first
    await prisma.$connect();
    console.log("Database connected successfully");
    
    // Start with a very simple query first
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
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

    console.log("Posts fetched successfully:", posts.length);

    return {
      posts: posts as PostWithRelations[],
      totalCount: posts.length,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  } catch (error) {
    console.error("Error fetching posts details:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error message:", errorMessage);
    if (error instanceof Error && error.stack) {
      console.error("Error stack:", error.stack);
    }
    throw new Error(`Failed to fetch posts: ${errorMessage}`);
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
