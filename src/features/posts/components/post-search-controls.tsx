"use client";

import { PostSearchBar } from "./post-search-bar";
import { PostFilters } from "./post-filters";

/**
 * Main wrapper component that combines search bar and filters
 * This component provides a complete search and filter interface for posts
 */
export function PostSearchControls() {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <PostSearchBar />
      
      {/* Filters and Sort Options */}
      <PostFilters />
    </div>
  );
}
