"use client";

import { CalendarIcon, Filter, RotateCcw, User } from "lucide-react";
import { usePostSearch, type SortOption, type VoteFilterOption } from "@/hooks/use-post-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PostFilters() {
  const {
    sort,
    author,
    votes,
    dateFrom,
    dateTo,
    updateSort,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    SORT_OPTIONS,
    VOTE_FILTER_OPTIONS,
  } = usePostSearch();

  const handleAuthorChange = (value: string) => {
    updateFilters({ author: value });
  };

  const handleVoteFilterChange = (value: VoteFilterOption) => {
    updateFilters({ votes: value });
  };

  const handleDateFromChange = (value: string) => {
    updateFilters({ dateFrom: value });
  };

  const handleDateToChange = (value: string) => {
    updateFilters({ dateTo: value });
  };

  const sortLabels: Record<SortOption, string> = {
    latest: "Latest",
    oldest: "Oldest",
    "most-liked": "Most Liked",
    "most-voted": "Most Voted",
  };

  const voteFilterLabels: Record<VoteFilterOption, string> = {
    all: "All Posts",
    positive: "Positive Votes",
    negative: "Negative Votes",
    "no-votes": "No Votes",
  };

  return (
    <div className="flex items-center gap-2">
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <Label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">
          Sort by:
        </Label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => updateSort(e.target.value as SortOption)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {sortLabels[option]}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Filters Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={hasActiveFilters() ? "border-primary" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters() && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                !
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Posts</DialogTitle>
            <DialogDescription>
              Refine your search with additional filters.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Author Filter */}
            <div className="grid gap-2">
              <Label htmlFor="author" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Author
              </Label>
              <Input
                id="author"
                placeholder="Filter by author name..."
                value={author}
                onChange={(e) => handleAuthorChange(e.target.value)}
              />
            </div>

            {/* Vote Filter */}
            <div className="grid gap-2">
              <Label htmlFor="votes">Vote Status</Label>
              <select
                id="votes"
                value={votes}
                onChange={(e) => handleVoteFilterChange(e.target.value as VoteFilterOption)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {VOTE_FILTER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {voteFilterLabels[option]}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date Range
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="dateFrom" className="text-sm text-muted-foreground">
                    From
                  </Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => handleDateFromChange(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo" className="text-sm text-muted-foreground">
                    To
                  </Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => handleDateToChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={!hasActiveFilters()}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Filters Button (when filters are active) */}
      {hasActiveFilters() && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}