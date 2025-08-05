"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePostSearch } from "@/hooks/use-post-search";
import {
  paginatePosts,
  processPostsWithFilters,
  type PostWithRelations,
} from "@/lib/post-filters";
import { Heart, MessageCircle, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { useMemo } from "react";
import { PostPagination } from "./post-pagination";
import { PostSearchControls } from "./post-search-controls";

interface PostsListWithSearchProps {
  posts: PostWithRelations[];
  pageSize?: number;
}

// Simple post card component for demonstration
function PostCard({ post }: { post: PostWithRelations }) {
  const upVotes = post.votes.filter((vote) => vote.type === "UP").length;
  const downVotes = post.votes.filter((vote) => vote.type === "DOWN").length;
  const likesCount = post.likes.length;
  const commentsCount = post.comments.length;

  // Handle anonymous posts
  const authorName = post.isAnonymous
    ? post.authorName || "Anonyme"
    : post.user?.name || "Utilisateur";

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {authorName}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3 mb-4">
          {post.content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              {upVotes}
            </div>
            <div className="flex items-center gap-1">
              <ThumbsDown className="h-4 w-4" />
              {downVotes}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {likesCount}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {commentsCount}
            </div>
          </div>

          <Badge variant="secondary">
            {new Date(post.createdAt).toLocaleDateString()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton component
function PostSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="h-6 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// Empty state component
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">📝</div>
      <h3 className="text-lg font-semibold mb-2">
        {hasFilters ? "No posts found" : "No posts yet"}
      </h3>
      <p className="text-muted-foreground">
        {hasFilters
          ? "Try adjusting your search filters to find what you're looking for."
          : "Be the first to create a post!"}
      </p>
    </div>
  );
}

export function PostsListWithSearch({
  posts,
  pageSize = 10,
}: PostsListWithSearchProps) {
  const searchState = usePostSearch();

  // Process posts with current filters and search
  const processedData = useMemo(() => {
    // Apply filters and sorting
    const filteredAndSorted = processPostsWithFilters(posts, searchState);

    // Apply pagination
    const paginatedResult = paginatePosts(
      filteredAndSorted,
      searchState.page,
      pageSize
    );

    return {
      posts: paginatedResult.posts,
      totalPages: paginatedResult.totalPages,
      totalCount: paginatedResult.totalCount,
      hasNextPage: paginatedResult.hasNextPage,
      hasPreviousPage: paginatedResult.hasPreviousPage,
    };
  }, [posts, searchState, pageSize]);

  const hasActiveFilters = searchState.hasActiveFilters();

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <PostSearchControls />

      {/* Results Summary */}
      {processedData.totalCount > 0 && (
        <div className="text-sm text-muted-foreground">
          {processedData.totalCount === posts.length
            ? `Showing all ${processedData.totalCount} posts`
            : `Found ${processedData.totalCount} of ${posts.length} posts`}
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {processedData.posts.length > 0 ? (
          processedData.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <EmptyState hasFilters={hasActiveFilters} />
        )}
      </div>

      {/* Pagination */}
      <PostPagination
        totalPages={processedData.totalPages}
        totalCount={processedData.totalCount}
        pageSize={pageSize}
      />
    </div>
  );
}
