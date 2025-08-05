"use client";

import { usePostSearch } from "@/hooks/use-post-search";
import {
  paginatePosts,
  processPostsWithFilters,
  type PostWithRelations,
} from "@/lib/post-filters";
import { useMemo } from "react";
import { toast } from "sonner";
import { commentPostAction } from "../actions/comment-post.action";
import { likePostAction } from "../actions/like-post.action";
import { EnhancedPostCard } from "./enhanced-post-card";
import { PostPagination } from "./post-pagination";
import { PostSearchControls } from "./post-search-controls";

interface PostsListWithSearchProps {
  posts: PostWithRelations[];
  pageSize?: number;
}

// Enhanced post card wrapper with server actions
function PostCard({ post }: { post: PostWithRelations }) {
  const handleLike = async (postId: string) => {
    try {
      const result = await likePostAction(postId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Erreur lors du like");
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      const result = await commentPostAction({ postId, content });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Erreur lors du commentaire");
    }
  };

  return (
    <EnhancedPostCard
      post={post}
      onLike={handleLike}
      onComment={handleComment}
    />
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
