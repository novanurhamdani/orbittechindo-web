import { useQuery, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/app/api";
import { useMovieStore } from "@/lib/store";
import { useEffect, useCallback } from "react";
import { MovieFilter, SearchResponse } from "@/types";

export function useMovieSearch(initialQuery = "") {
  const {
    searchQuery,
    setSearchQuery,
    setSearchResults,
    setIsLoading,
    setError,
    currentPage,
    filter,
  } = useMovieStore();

  const queryClient = useQueryClient();

  // Set initial query if provided
  useEffect(() => {
    if (initialQuery && !searchQuery && initialQuery.trim()) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery, searchQuery, setSearchQuery]);

  // Use TanStack Query for data fetching
  const { data, isLoading, error, refetch } = useQuery<SearchResponse>({
    queryKey: ["movies", searchQuery, currentPage, filter],
    queryFn: () => {
      // Double check to make sure we never search with empty string
      if (!searchQuery.trim()) {
        return Promise.resolve({
          Search: [],
          totalResults: "0",
          Response: "False",
          Error: "Empty search query",
        });
      }
      return movieService.searchMovies(searchQuery, currentPage, filter);
    },
    enabled: searchQuery.length > 0 && searchQuery.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update store with results
  useEffect(() => {
    setIsLoading(isLoading);

    if (data) {
      if (data.Response === "True" && data.Search && data.totalResults) {
        // Make sure we convert totalResults to a number and pass it to the store
        const totalResults = parseInt(data.totalResults || "0", 10);

        // Apply client-side filtering for year
        if (filter.year) {
          const filteredResults = data.Search.filter((movie) => {
            // Handle different year formats (YYYY or YYYY–YYYY)
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

          // Update with filtered results and count
          setSearchResults(filteredResults, totalResults);
        } else {
          // No year filtering needed, use API results directly
          setSearchResults(data.Search, totalResults);
        }

        setError(null);
      } else {
        setSearchResults([], 0);
        setError(data.Error || "No results found");
      }
    }

    if (error) {
      setError((error as Error).message);
    }
  }, [
    data,
    isLoading,
    error,
    setSearchResults,
    setIsLoading,
    setError,
    filter,
  ]);

  // Function to manually trigger a search
  const search = useCallback(
    (query: string, page: number, filter: MovieFilter) => {
      // Only proceed if query is not empty
      if (!query.trim()) {
        setSearchResults([], 0);
        setSearchQuery("");
        return Promise.resolve();
      }

      setSearchQuery(query);
      queryClient.invalidateQueries({
        queryKey: ["movies", query, page, filter],
      });
      return refetch();
    },
    [queryClient, refetch, setSearchQuery, setSearchResults]
  );

  return {
    searchQuery,
    results: data?.Search || [],
    totalResults: data?.totalResults ? parseInt(data.totalResults, 10) : 0,
    isLoading,
    error: error ? (error as Error).message : data?.Error || null,
    search,
  };
}
