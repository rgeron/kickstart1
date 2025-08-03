"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePostSearch } from "@/hooks/use-post-search";
import { Button } from "@/components/ui/button";

interface PostPaginationProps {
  totalPages: number;
  totalCount: number;
  pageSize?: number;
}

export function PostPagination({ 
  totalPages, 
  totalCount, 
  pageSize = 10 
}: PostPaginationProps) {
  const { page, updatePage } = usePostSearch();

  if (totalPages <= 1) {
    return null;
  }

  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalCount);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (page <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push("...");
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Results info */}
      <p className="text-sm text-muted-foreground">
        Showing {startIndex} to {endIndex} of {totalCount} results
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((pageNum, index) => (
          <span key={index}>
            {pageNum === "..." ? (
              <span className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => updatePage(pageNum as number)}
                className="h-8 w-8 p-0"
              >
                {pageNum}
              </Button>
            )}
          </span>
        ))}

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => updatePage(page + 1)}
          disabled={page >= totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}