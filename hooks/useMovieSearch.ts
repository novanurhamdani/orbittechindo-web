import { useQuery, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/app/api";
import { MovieFilter, SearchResponse, Movie } from "@/types";
import { useCallback } from "react";

export function useMovieSearch(
  query: string,
  page: number,
  filter: MovieFilter
) {
  const queryClient = useQueryClient();

  // Use TanStack Query for data fetching
  const { data, isLoading, isError, error } = useQuery<SearchResponse, Error>({
    queryKey: ["movies", "search", query, page, filter],
    queryFn: async () => {
      // Don't search with empty string
      if (!query.trim()) {
        return {
          Search: [],
          totalResults: "0",
          Response: "False",
          Error: "Empty search query",
        };
      }
      return movieService.searchMovies(query, page, filter);
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Process the results
  let movies: Movie[] = [];
  let totalResults = 0;

  if (data?.Response === "True" && data.Search && data.totalResults) {
    totalResults = parseInt(data.totalResults || "0", 10);

    // Apply client-side filtering for year if needed
    if (filter.year) {
      movies = data.Search.filter((movie) => {
        const yearStr = movie.Year;
        let year: number;

        if (yearStr.includes("–")) {
          // For series with year ranges like "2018–2023", use the start year
          year = parseInt(yearStr.split("–")[0]);
        } else {
          year = parseInt(yearStr);
        }

        return !isNaN(year) && year === filter.year;
      });
    } else {
      movies = data.Search;
    }
  }

  // Function to manually invalidate search results
  const invalidateSearch = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: ["movies", "search", query, page, filter],
    });
  }, [queryClient, query, page, filter]);

  return {
    movies,
    totalResults,
    isLoading,
    isError,
    error,
    invalidateSearch,
  };
}
