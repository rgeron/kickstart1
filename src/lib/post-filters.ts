import type { SortOption, VoteFilterOption } from "@/hooks/use-post-search";

// Post type based on the Prisma schema
export interface PostWithRelations {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  userId: string | null;
  isAnonymous: boolean;
  authorName?: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
  likes: Array<{ userId: string }>;
  votes: Array<{ type: "UP" | "DOWN"; userId: string }>;
  comments: Array<{ id: string }>;
  _count?: {
    likes: number;
    votes: number;
    comments: number;
  };
}

export interface PostSearchParams {
  q?: string;
  sort?: SortOption;
  page?: number;
  author?: string;
  votes?: VoteFilterOption;
  dateFrom?: string;
  dateTo?: string;
}

// Client-side filtering utilities
export function filterPosts(
  posts: PostWithRelations[],
  params: PostSearchParams
): PostWithRelations[] {
  let filteredPosts = [...posts];

  // Search query filter
  if (params.q) {
    const query = params.q.toLowerCase().trim();
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.user.name.toLowerCase().includes(query)
    );
  }

  // Author filter
  if (params.author) {
    const authorQuery = params.author.toLowerCase().trim();
    filteredPosts = filteredPosts.filter((post) =>
      post.user.name.toLowerCase().includes(authorQuery)
    );
  }

  // Vote filter
  if (params.votes && params.votes !== "all") {
    filteredPosts = filteredPosts.filter((post) => {
      const upVotes = post.votes.filter((vote) => vote.type === "UP").length;
      const downVotes = post.votes.filter(
        (vote) => vote.type === "DOWN"
      ).length;
      const totalVotes = post.votes.length;

      switch (params.votes) {
        case "positive":
          return upVotes > downVotes;
        case "negative":
          return downVotes > upVotes;
        case "no-votes":
          return totalVotes === 0;
        default:
          return true;
      }
    });
  }

  // Date range filter
  if (params.dateFrom) {
    const fromDate = new Date(params.dateFrom);
    filteredPosts = filteredPosts.filter(
      (post) => new Date(post.createdAt) >= fromDate
    );
  }

  if (params.dateTo) {
    const toDate = new Date(params.dateTo);
    toDate.setHours(23, 59, 59, 999); // End of day
    filteredPosts = filteredPosts.filter(
      (post) => new Date(post.createdAt) <= toDate
    );
  }

  return filteredPosts;
}

// Sorting utilities
export function sortPosts(
  posts: PostWithRelations[],
  sortOption: SortOption
): PostWithRelations[] {
  const sortedPosts = [...posts];

  switch (sortOption) {
    case "latest":
      return sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    case "oldest":
      return sortedPosts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    case "most-liked":
      return sortedPosts.sort((a, b) => {
        const aLikes = a.likes?.length || 0;
        const bLikes = b.likes?.length || 0;
        return bLikes - aLikes;
      });

    case "most-voted":
      return sortedPosts.sort((a, b) => {
        const aVotes = a.votes?.length || 0;
        const bVotes = b.votes?.length || 0;
        return bVotes - aVotes;
      });

    default:
      return sortedPosts;
  }
}

// Combined filter and sort function
export function processPostsWithFilters(
  posts: PostWithRelations[],
  params: PostSearchParams
): PostWithRelations[] {
  // First filter
  const filteredPosts = filterPosts(posts, params);

  // Then sort
  const sortedPosts = sortPosts(filteredPosts, params.sort || "latest");

  return sortedPosts;
}

// Pagination utilities
export function paginatePosts(
  posts: PostWithRelations[],
  page: number = 1,
  pageSize: number = 10
): {
  posts: PostWithRelations[];
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / pageSize);

  return {
    posts: paginatedPosts,
    totalPages,
    totalCount: posts.length,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

// Server-side query building utilities
export function buildPostsQuery(params: PostSearchParams) {
  const where: any = {};
  const orderBy: any[] = [];

  // Search query
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { content: { contains: params.q, mode: "insensitive" } },
      { user: { name: { contains: params.q, mode: "insensitive" } } },
    ];
  }

  // Author filter
  if (params.author) {
    where.user = {
      name: { contains: params.author, mode: "insensitive" },
    };
  }

  // Date range filter
  if (params.dateFrom || params.dateTo) {
    where.createdAt = {};
    if (params.dateFrom) {
      where.createdAt.gte = new Date(params.dateFrom);
    }
    if (params.dateTo) {
      const toDate = new Date(params.dateTo);
      toDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = toDate;
    }
  }

  // Sorting
  switch (params.sort) {
    case "latest":
      orderBy.push({ createdAt: "desc" });
      break;
    case "oldest":
      orderBy.push({ createdAt: "asc" });
      break;
    case "most-liked":
      orderBy.push({ likes: { _count: "desc" } });
      break;
    case "most-voted":
      orderBy.push({ votes: { _count: "desc" } });
      break;
    default:
      orderBy.push({ createdAt: "desc" });
  }

  return { where, orderBy };
}

// Helper function to get vote counts
export function getVoteCounts(post: PostWithRelations): {
  upVotes: number;
  downVotes: number;
  totalVotes: number;
  score: number;
} {
  const upVotes = post.votes.filter((vote) => vote.type === "UP").length;
  const downVotes = post.votes.filter((vote) => vote.type === "DOWN").length;
  const totalVotes = post.votes.length;
  const score = upVotes - downVotes;

  return { upVotes, downVotes, totalVotes, score };
}
