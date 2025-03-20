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
  const { search, isLoading: isSearchLoading } = useMovieSearch();
  const {
    movies: allMovies,
    isLoading: isAllMoviesLoading,
    currentPage: allMoviesPage,
    totalPages: allMoviesTotalPages,
    handlePageChange: handleAllMoviesPageChange,
  } = useAllMovies();

  const {
    searchQuery,
    searchResults,
    totalResults,
    currentPage,
    filter,
    setSearchQuery,
    setCurrentPage,
    setFilter,
  } = useMovieStore();

  // Calculate total pages for search results
  const totalPages = Math.ceil(totalResults / 10);
  
  // For debugging
  console.log('Search data:', { searchResults, totalResults, totalPages });

  // Handle search submission
  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchQuery("");
        return;
      }

      setSearchQuery(query);
      setCurrentPage(1);
      search(query, 1, filter);
    },
    [filter, search, setCurrentPage, setSearchQuery]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (!searchQuery.trim()) return;

      setCurrentPage(page);
      search(searchQuery, page, filter);
    },
    [filter, search, searchQuery, setCurrentPage]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (newFilter: MovieFilter) => {
      if (!searchQuery.trim()) return;

      setFilter(newFilter);
      setCurrentPage(1);
      search(searchQuery, 1, newFilter);
    },
    [search, searchQuery, setCurrentPage, setFilter]
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
              {/* Filters */}
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
              <h2 className="text-xl font-semibold mb-4">All Movies</h2>
              <MovieGrid movies={allMovies} isLoading={isAllMoviesLoading} />
              {allMoviesTotalPages > 0 && (
                <Pagination
                  currentPage={allMoviesPage}
                  totalPages={allMoviesTotalPages}
                  onPageChange={handleAllMoviesPageChange}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
