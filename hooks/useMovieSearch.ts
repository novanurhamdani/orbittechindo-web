import { useQuery, useQueryClient } from "@tanstack/react-query";
import { movieService } from "@/app/api";
import { useMovieStore } from "@/lib/store";
import { useEffect } from "react";
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
    if (initialQuery && !searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery, searchQuery, setSearchQuery]);

  // Use TanStack Query for data fetching
  const { data, isLoading, error, refetch } = useQuery<SearchResponse>({
    queryKey: ["movies", searchQuery, currentPage, filter],
    queryFn: () => movieService.searchMovies(searchQuery, currentPage, filter),
    enabled: searchQuery.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update store with results
  useEffect(() => {
    setIsLoading(isLoading);

    if (data) {
      if (data.Response === "True" && data.Search) {
        setSearchResults(data.Search, parseInt(data.totalResults || "0"));
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

      setSearchResults(filteredResults, filteredResults.length);
    }
  }, [data, filter.yearStart, filter.yearEnd, setSearchResults]);

  // Function to manually trigger a search
  const search = (query: string, page: number, filter: MovieFilter) => {
    setSearchQuery(query);
    queryClient.invalidateQueries({
      queryKey: ["movies", query, page, filter],
    });
    return refetch();
  };

  return {
    searchQuery,
    setSearchQuery,
    isLoading,
    error: error ? (error as Error).message : null,
    search,
  };
}
