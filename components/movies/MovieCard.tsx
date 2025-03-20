import Image from "next/image";
import Link from "next/link";
import { Movie, MovieDetail } from "@/types";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/app/api";
import { Star } from "lucide-react";
import { FavoriteButton } from "@/components/animation";
import { useAuthStore, useFavoritesStore } from "@/lib/store";
import { staggerItem } from "@/components/animation/StaggerContainer";

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

  // Auth and Favorites store
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isMovieFavorite = isFavorite(movie.imdbID);

  // Default image if poster is not available
  const posterUrl =
    movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.png";

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="glass-card overflow-hidden shadow-lg hover-glow relative group"
    >
      {isAuthenticated ? (
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            isFavorite={isMovieFavorite}
            onToggle={() => toggleFavorite(movie)}
            size="md"
            className="glass backdrop-blur-sm"
          />
        </div>
      ) : null}

      <Link href={`/movies/${movie.imdbID}`} className="block">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={posterUrl}
            alt={movie.Title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030711]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="p-5 backdrop-blur-sm bg-[#030711]/30">
          <h3 className="text-lg font-semibold text-white/90 h-[3rem] overflow-hidden">
            {movie.Title.length > 30
              ? `${movie.Title.slice(0, 30)}...`
              : movie.Title}
          </h3>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-white/70">{movie.Year}</span>
            {isLoading ? (
              <span className="text-xs px-3 py-1 bg-[#D00000]/20 text-[#FFBA08] rounded-full flex items-center backdrop-blur-sm animate-pulse">
                Loading...
              </span>
            ) : movieDetails?.imdbRating && movieDetails.imdbRating !== "N/A" ? (
              <span 
                className={`text-xs px-3 py-1 rounded-full flex items-center backdrop-blur-sm ${
                  parseFloat(movieDetails.imdbRating) < 5
                    ? "bg-[#D00000]/20 text-[#FF0000]"
                    : parseFloat(movieDetails.imdbRating) >= 8
                    ? "bg-[#008000]/20 text-[#00FF00]"
                    : "bg-[#D00000]/20 text-[#FFBA08]"
                }`}
              >
                <Star className={`w-3 h-3 mr-1 ${
                  parseFloat(movieDetails.imdbRating) < 5
                    ? "text-[#FF0000]"
                    : parseFloat(movieDetails.imdbRating) >= 8
                    ? "text-[#00FF00]"
                    : "text-[#FFBA08]"
                }`} />
                {movieDetails.imdbRating}
              </span>
            ) : (
              <span className="text-xs px-3 py-1 bg-[#D00000]/20 text-[#FFBA08] rounded-full flex items-center backdrop-blur-sm">
                N/A
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
