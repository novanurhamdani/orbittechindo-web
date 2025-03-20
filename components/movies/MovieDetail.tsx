import Image from "next/image";
import { MovieDetail as MovieDetailType } from "@/types";
import { formatGenres } from "@/lib/utils/format";
import { MovieRatingChart } from "./MovieRatingChart";
import { MovieGenreChart } from "./MovieGenreChart";

interface MovieDetailProps {
  movie: MovieDetailType;
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const posterUrl =
    movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.png";

  const genres = formatGenres(movie.Genre);

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Movie poster */}
        <div className="md:col-span-1">
          <div className="relative aspect-[2/3] w-full">
            <Image
              src={posterUrl}
              alt={movie.Title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Movie info */}
        <div className="p-6 md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {movie.Year}
            </span>
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {movie.Rated}
            </span>
            <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {movie.Runtime}
            </span>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="text-muted-foreground mb-4">{movie.Plot}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Director
                </h3>
                <p>{movie.Director}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Writer
                </h3>
                <p>{movie.Writer}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Actors
                </h3>
                <p>{movie.Actors}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Language
                </h3>
                <p>{movie.Language}</p>
              </div>
              {movie.Awards !== "N/A" && (
                <div className="sm:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Awards
                  </h3>
                  <p>{movie.Awards}</p>
                </div>
              )}
            </div>
          </div>

          {/* Data Visualization Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Movie Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Genre Distribution Chart */}
              <div className="bg-card p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">
                  Genre Distribution
                </h3>
                <div className="h-64 md:h-80">
                  <MovieGenreChart movie={movie} />
                </div>
              </div>

              {/* Ratings Chart */}
              <div className="bg-card p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4">
                  Ratings Comparison
                </h3>
                <div className="h-64 md:h-80">
                  <h3 className="text-lg font-medium mb-2">
                    Genre Distribution
                  </h3>
                  <div className="h-64">
                    <MovieRatingChart movie={movie} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
