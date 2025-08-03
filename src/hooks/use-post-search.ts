"use client";

import { parseAsString, parseAsStringEnum, parseAsInteger, useQueryStates } from "nuqs";

// Define sort options
const SORT_OPTIONS = ["latest", "oldest", "most-liked", "most-voted"] as const;
type SortOption = typeof SORT_OPTIONS[number];

// Define filter options
const VOTE_FILTER_OPTIONS = ["all", "positive", "negative", "no-votes"] as const;
type VoteFilterOption = typeof VOTE_FILTER_OPTIONS[number];

// Post search and filter state management
export function usePostSearch() {
  const [searchState, setSearchState] = useQueryStates(
    {
      // Search query
      q: parseAsString.withDefault(""),
      
      // Sorting
      sort: parseAsStringEnum<SortOption>([...SORT_OPTIONS]).withDefault("latest"),
      
      // Pagination
      page: parseAsInteger.withDefault(1),
      
      // Filters
      author: parseAsString.withDefault(""),
      votes: parseAsStringEnum<VoteFilterOption>([...VOTE_FILTER_OPTIONS]).withDefault("all"),
      
      // Date range (optional)
      dateFrom: parseAsString.withDefault(""),
      dateTo: parseAsString.withDefault(""),
    },
    {
      // Options for all query states
      shallow: false, // Update URL completely for better sharing
      clearOnDefault: true, // Remove params when they match default values
    }
  );

  // Helper functions for common operations
  const updateSearch = (query: string) => {
    setSearchState({ q: query, page: 1 }); // Reset to page 1 when searching
  };

  const updateSort = (sort: SortOption) => {
    setSearchState({ sort, page: 1 }); // Reset to page 1 when sorting changes
  };

  const updateFilters = (filters: {
    author?: string;
    votes?: VoteFilterOption;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    setSearchState({ ...filters, page: 1 }); // Reset to page 1 when filters change
  };

  const updatePage = (page: number) => {
    setSearchState({ page });
  };

  const clearFilters = () => {
    setSearchState({
      q: "",
      sort: "latest",
      page: 1,
      author: "",
      votes: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters = () => {
    return (
      searchState.q !== "" ||
      searchState.sort !== "latest" ||
      searchState.author !== "" ||
      searchState.votes !== "all" ||
      searchState.dateFrom !== "" ||
      searchState.dateTo !== ""
    );
  };

  // Build search parameters for API calls
  const getSearchParams = () => {
    const params = new URLSearchParams();
    
    if (searchState.q) params.set("q", searchState.q);
    if (searchState.sort !== "latest") params.set("sort", searchState.sort);
    if (searchState.page > 1) params.set("page", searchState.page.toString());
    if (searchState.author) params.set("author", searchState.author);
    if (searchState.votes !== "all") params.set("votes", searchState.votes);
    if (searchState.dateFrom) params.set("dateFrom", searchState.dateFrom);
    if (searchState.dateTo) params.set("dateTo", searchState.dateTo);
    
    return params;
  };

  return {
    // Current state
    ...searchState,
    
    // Update functions
    updateSearch,
    updateSort,
    updateFilters,
    updatePage,
    clearFilters,
    
    // Utility functions
    hasActiveFilters,
    getSearchParams,
    
    // Constants for UI
    SORT_OPTIONS,
    VOTE_FILTER_OPTIONS,
  };
}

// Type exports for use in other components
export type { SortOption, VoteFilterOption };