import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  // Calculate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    // If total pages is less than max pages to show
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust start and end to always show 3 pages in the middle
      if (start === 2) end = Math.min(4, totalPages - 1);
      if (end === totalPages - 1) start = Math.max(2, totalPages - 3);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center space-x-1">
        {/* Previous page button */}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </li>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === "ellipsis-start" || page === "ellipsis-end" ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => typeof page === "number" && onPageChange(page)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            )}
          </li>
        ))}

        {/* Next page button */}
        <li>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
