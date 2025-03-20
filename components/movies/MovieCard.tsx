import Image from "next/image";
import Link from "next/link";
import { Movie, MovieDetail } from "@/types";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/app/api";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  // Use React Query to fetch movie details
  const { data: movieDetails, isLoading } = useQuery<MovieDetail>({
    queryKey: ["movie", movie.imdbID],
    queryFn: () => movieService.getMovieById(movie.imdbID),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Default image if poster is not available
  const posterUrl =
    movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.png";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <Link href={`/movies/${movie.imdbID}`} className="block">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={posterUrl}
            alt={movie.Title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold line-clamp-2">{movie.Title}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-muted-foreground">{movie.Year}</span>
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full flex items-center">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : movieDetails?.imdbRating &&
                movieDetails.imdbRating !== "N/A" ? (
                <>
                  <Star className="w-3 h-3 mr-1" /> {movieDetails.imdbRating}
                </>
              ) : (
                "N/A"
              )}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
