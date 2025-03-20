import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { movieService } from "@/app/api";

export function useAllMovies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["allMovies", currentPage],
    queryFn: async () => {
      const response = await movieService.getAllMovies(currentPage);
      if (response.Response === "True" && response.Search) {
        setTotalResults(parseInt(response.totalResults || "0"));
        return response.Search;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / 10);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return {
    movies: data || [],
    isLoading,
    error: error ? (error as Error).message : null,
    currentPage,
    totalPages,
    totalResults,
    handlePageChange,
  };
}
