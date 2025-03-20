"use client";

import { useEffect } from "react";
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
    handlePageChange: handleAllMoviesPageChange
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

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / 10);

  // Handle search submission
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    search(query, 1, filter);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    search(searchQuery, page, filter);
  };

  // Handle filter change
  const handleFilterChange = (newFilter: MovieFilter) => {
    setFilter(newFilter);
    search(searchQuery, 1, newFilter);
    setCurrentPage(1);
  };

  // Initial search if query exists
  useEffect(() => {
    if (searchQuery) {
      search(searchQuery, currentPage, filter);
    }
  }, [searchQuery, currentPage, filter, search]);

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

        {/* Search section */}
        <section className="mb-8">
          <div className="mb-6">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          </div>

          {searchQuery ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Filters */}
              <div className="md:col-span-1">
                <MovieFilters
                  initialFilter={filter}
                  onFilterChange={handleFilterChange}
                />
              </div>

              {/* Results */}
              <div className="md:col-span-3">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    {isSearchLoading
                      ? "Searching..."
                      : `Results for "${searchQuery}" (${totalResults} found)`}
                  </h2>
                </div>

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
              <div className="mb-4">
                <h2 className="text-xl font-semibold">All Movies</h2>
              </div>
              <MovieGrid
                movies={allMovies}
                isLoading={isAllMoviesLoading}
              />
              {allMoviesTotalPages > 0 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={allMoviesPage}
                    totalPages={allMoviesTotalPages}
                    onPageChange={handleAllMoviesPageChange}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
