"use client";

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

export default function Home() {
  const { featuredMovies, isLoading: isFeaturedLoading } = useFeaturedMovies();

  // Get global state from Zustand
  const { searchQuery, currentPage, filter } = useMovieStore();

  // Use React Query for filter all movie with Zustand state
  const {
    movies: allMovies,
    isLoading: isAllMoviesLoading,
    totalPages: allMoviesTotalPages,
  } = useAllMovies(currentPage, filter);

  // Use React Query for search with Zustand state
  const {
    movies: searchResults,
    totalResults,
    isLoading: isSearchLoading,
  } = useMovieSearch(searchQuery, currentPage, filter);

  // Calculate total pages for search results
  const totalPages = Math.ceil(totalResults / 10);

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
          <SearchBar />

          {searchQuery ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Filters for search results */}
              <MovieFilters />

              {/* Results */}
              <div className="md:col-span-3">
                <h2 className="text-xl font-semibold mb-4">
                  {isSearchLoading
                    ? "Searching..."
                    : `Results for "${searchQuery}" (${totalResults} found)`}
                </h2>
                <MovieGrid movies={searchResults} isLoading={isSearchLoading} />
                {totalResults > 0 && <Pagination totalPages={totalPages} />}
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Filters for all movies */}
                <MovieFilters />
                <div className="md:col-span-3">
                  <h2 className="text-xl font-semibold mb-4">All Movies</h2>
                  <MovieGrid
                    movies={allMovies}
                    isLoading={isAllMoviesLoading}
                  />
                  {allMoviesTotalPages > 0 && (
                    <Pagination totalPages={allMoviesTotalPages} />
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
