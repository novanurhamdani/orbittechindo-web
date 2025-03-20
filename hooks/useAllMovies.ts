import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { movieService } from "@/app/api";
import { MovieFilter } from "@/types";

export function useAllMovies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filter, setFilter] = useState<MovieFilter>({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["allMovies", currentPage, filter],
    queryFn: async () => {
      const response = await movieService.getAllMovies(currentPage, filter);
      if (response.Response === "True" && response.Search) {
        setTotalResults(parseInt(response.totalResults || "0"));
        return response.Search;
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Refetch when the page changes or filter changes
  useEffect(() => {
    refetch();
  }, [currentPage, filter, refetch]);

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / 10);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Handle filter change
  const handleFilterChange = useCallback((newFilter: MovieFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);

    // Scroll to top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return {
    movies: data || [],
    isLoading,
    error: error ? (error as Error).message : null,
    currentPage,
    totalPages,
    totalResults,
    filter,
    handlePageChange,
    handleFilterChange,
  };
}
