"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounceFn } from "@/hooks/use-debounce-fn";
import { usePostSearch } from "@/hooks/use-post-search";
import { Search, X } from "lucide-react";
import { useCallback, useState } from "react";

export function PostSearchBar() {
  const { q, updateSearch } = usePostSearch();
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search input to avoid too many URL updates
  const debouncedUpdateSearch = useDebounceFn((value: string) => {
    setIsSearching(true);
    updateSearch(value);
    // Reset loading state after a short delay
    setTimeout(() => setIsSearching(false), 150);
  }, 300);

  const handleSearchChange = useCallback(
    (value: string) => {
      debouncedUpdateSearch(value);
    },
    [debouncedUpdateSearch]
  );

  const clearSearch = () => {
    updateSearch("");
  };

  return (
    <div className="relative">
      <div className="relative">
        {isSearching ? (
          <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="15 85"
              />
            </svg>
          </div>
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <Input
          placeholder="Search posts..."
          value={q}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {q && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </div>
  );
}
