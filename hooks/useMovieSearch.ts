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
      if (data.Response === "True" && data.Search) {
        // Make sure we convert totalResults to a number and pass it to the store
        const totalResults = parseInt(data.totalResults || "0", 10);

        setSearchResults(data.Search, totalResults);
        setError(null);
      } else {
        setSearchResults([], 0);
        setError(data.Error || "No results found");
      }
    }

    if (error) {
      setError((error as Error).message);
    }
  }, [data, isLoading, error, setSearchResults, setIsLoading, setError]);

  // Client-side filtering for year range
  // (since OMDb API doesn't support year range directly)
  useEffect(() => {
    if (
      data?.Response === "True" &&
      data.Search &&
      filter.yearStart &&
      filter.yearEnd
    ) {
      const filteredResults = data.Search.filter((movie) => {
        const year = parseInt(movie.Year);
        return year >= filter.yearStart! && year <= filter.yearEnd!;
      });

      setSearchResults(filteredResults, parseInt(data.totalResults || "0"));
    }
  }, [data, filter.yearStart, filter.yearEnd, setSearchResults]);

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
    setSearchQuery,
    isLoading,
    error: error ? (error as Error).message : null,
    search,
  };
}
