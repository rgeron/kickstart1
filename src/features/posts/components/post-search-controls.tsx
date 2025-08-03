"use client";

import { PostSearchBar } from "./post-search-bar";
import { PostFilters } from "./post-filters";

export function PostSearchControls() {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <PostSearchBar />
      
      {/* Filters */}
      <div className="flex items-center justify-between">
        <PostFilters />
      </div>
    </div>
  );
}