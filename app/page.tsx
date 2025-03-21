"use client";

import { useCallback } from "react";
import { MainLayout } from "@/components/layout";
import {
  MovieCarousel,
  MovieGrid,
  SearchBar,
  MovieFilters,
  Pagination,
} from "../components/movies";
import { useFeaturedMovies, useMovieSearch, useAllMovies } from "@/hooks";
import { useMovieStore } from "@/lib/store";
import { MovieFilter } from "@/types";

export default function Home() {
  const { featuredMovies, isLoading: isFeaturedLoading } = useFeaturedMovies();
  const {
    movies: allMovies,
    isLoading: isAllMoviesLoading,
    currentPage: allMoviesPage,
    totalPages: allMoviesTotalPages,
    handlePageChange: handleAllMoviesPageChange,
    handleFilterChange: handleAllMoviesFilterChange,
  } = useAllMovies();

  // Get global state from Zustand
  const {
    searchQuery,
    currentPage,
    filter,
    setSearchQuery,
    setCurrentPage,
    setFilter,
    addRecentSearch,
  } = useMovieStore();

  // Use React Query for search with Zustand state
  const {
    movies: searchResults,
    totalResults,
    isLoading: isSearchLoading,
  } = useMovieSearch(searchQuery, currentPage, filter);

  // Calculate total pages for search results
  const totalPages = Math.ceil(totalResults / 10);

  // Handle search submission
  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchQuery("");
        return;
      }

      setSearchQuery(query);
      setCurrentPage(1);

      // Add to recent searches
      addRecentSearch(query);
    },
    [setSearchQuery, setCurrentPage, addRecentSearch]
  );

  // Handle page change for search results
  const handlePageChange = useCallback(
    (page: number) => {
      if (!searchQuery.trim()) return;

      setCurrentPage(page);

      // Scroll to top of the page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [searchQuery, setCurrentPage]
  );

  // Handle filter change for search results
  const handleFilterChange = useCallback(
    (newFilter: MovieFilter) => {
      if (!searchQuery.trim()) return;

      setFilter(newFilter);
    },
    [searchQuery, setFilter]
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero section with featured movies */}
        {!searchQuery && (
          <section className="mb-12">
            {isFeaturedLoading ? (
              <div className="aspect-[21/9] bg-muted animate-pulse rounded-lg" />
            ) : (
              featuredMovies && (
                <MovieCarousel
                  movies={featuredMovies}
                  title="Featured Movies"
                />
              )
            )}
          </section>
        )}

        {/* Movie section */}
        <section className="mb-8">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />

          {searchQuery ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Filters for search results */}
              <MovieFilters
                initialFilter={filter}
                onFilterChange={handleFilterChange}
              />

              {/* Results */}
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold mb-4">
                  {isSearchLoading
                    ? "Searching..."
                    : `Results for "${searchQuery}" (${totalResults} found)`}
                </h2>
                <MovieGrid movies={searchResults} isLoading={isSearchLoading} />
                {totalResults > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters for all movies */}
                <MovieFilters
                  initialFilter={{}}
                  onFilterChange={handleAllMoviesFilterChange}
                />
                <div className="md:col-span-3">
                  <h2 className="text-xl font-semibold mb-4">All Movies</h2>
                  <MovieGrid
                    movies={allMovies}
                    isLoading={isAllMoviesLoading}
                  />
                  {allMoviesTotalPages > 0 && (
                    <Pagination
                      currentPage={allMoviesPage}
                      totalPages={allMoviesTotalPages}
                      onPageChange={handleAllMoviesPageChange}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
