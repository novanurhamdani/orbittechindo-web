import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { movieService } from "@/app/api";
import { MovieFilter } from "@/types";

export function useAllMovies(page: number, filter: MovieFilter) {
  const [totalResults, setTotalResults] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["allMovies", page, filter],
    queryFn: async () => {
      const response = await movieService.getAllMovies(page, filter);
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
  }, [page, filter, refetch]);

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / 10);

  return {
    movies: data || [],
    isLoading,
    error: error ? (error as Error).message : null,
    page,
    totalPages,
    totalResults,
    filter,
  };
}
