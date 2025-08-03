"use client";

import { Search, X } from "lucide-react";
import { useCallback } from "react";
import { useDebounceFn } from "@/hooks/use-debounce-fn";
import { usePostSearch } from "@/hooks/use-post-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function PostSearchBar() {
  const { q, updateSearch } = usePostSearch();

  // Debounce search input to avoid too many URL updates
  const debouncedUpdateSearch = useDebounceFn(updateSearch, 300);

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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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