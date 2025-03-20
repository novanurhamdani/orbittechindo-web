import { Movie } from "@/types";
import { MovieCard } from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
}

export function MovieGrid({ movies, isLoading = false }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="bg-card rounded-lg overflow-hidden shadow animate-pulse"
          >
            <div className="aspect-[2/3] bg-muted" />
            <div className="p-4">
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
}
