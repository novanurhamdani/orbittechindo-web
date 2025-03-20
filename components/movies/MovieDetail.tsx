import Image from "next/image";
import { MovieDetail as MovieDetailType } from "@/types";
import { formatGenres } from "@/lib/utils/format";
import { MovieRatingChart } from "./MovieRatingChart";
import { MovieGenreChart } from "./MovieGenreChart";
import { motion } from "framer-motion";
import { FavoriteButton } from "@/components/animation";
import { useAuthStore, useFavoritesStore } from "@/lib/store";
import {
  Star,
  Calendar,
  Clock,
  Award,
  Film,
  User,
  Users,
  Globe,
  PenTool,
} from "lucide-react";

interface MovieDetailProps {
  movie: MovieDetailType;
}

export function MovieDetail({ movie }: MovieDetailProps) {
  const posterUrl =
    movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.png";

  const genres = formatGenres(movie.Genre);

  // Auth and Favorites store
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isMovieFavorite = isFavorite(movie.imdbID);

  // Get rating color based on value
  const getRatingColor = (rating: string) => {
    const value = parseFloat(rating);
    if (value < 5) return "text-red-500";
    if (value >= 8) return "text-green-500";
    return "text-yellow-500";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="glass rounded-xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Movie poster */}
          <motion.div
            className="md:col-span-1 relative p-4"
            variants={itemVariants}
          >
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <Image
                src={posterUrl}
                alt={movie.Title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>

            {isAuthenticated && (
              <motion.div
                className="absolute top-8 right-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <FavoriteButton
                  isFavorite={isMovieFavorite}
                  onToggle={() => toggleFavorite(movie)}
                  size="lg"
                  className="bg-black/50 backdrop-blur-sm shadow-xl"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Movie info */}
          <motion.div className="p-6 md:col-span-2" variants={itemVariants}>
            <motion.h1
              className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              {movie.Title}

              {/* Rating badge */}
              <div className="bg-black/60 w-20 text-sm backdrop-blur-sm px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                <Star
                  className={`w-4 h-4 ${getRatingColor(movie.imdbRating)}`}
                  fill="currentColor"
                />
                <span
                  className={`font-bold ${getRatingColor(movie.imdbRating)}`}
                >
                  {movie.imdbRating}
                </span>
                <span className="text-xs text-gray-400">/10</span>
              </div>
            </motion.h1>

            <motion.div
              className="flex flex-wrap gap-2 mb-6"
              variants={itemVariants}
            >
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm flex items-center gap-1 text-sm rounded-full border border-white/5">
                <Calendar className="w-3 h-3" />
                {movie.Year}
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm flex items-center gap-1 text-sm rounded-full border border-white/5">
                <Film className="w-3 h-3" />
                {movie.Rated}
              </span>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-sm flex items-center gap-1 text-sm rounded-full border border-white/5">
                <Clock className="w-3 h-3" />
                {movie.Runtime}
              </span>
            </motion.div>

            <motion.div className="mb-8" variants={itemVariants}>
              <motion.div
                className="flex flex-wrap gap-2 mb-6"
                variants={itemVariants}
              >
                {genres.map((genre, index) => (
                  <motion.span
                    key={genre}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm text-white text-sm rounded-full border border-white/10 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: "rgba(255,255,255,0.15)",
                    }}
                  >
                    {genre}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                className="text-gray-300 mb-6 leading-relaxed text-base md:text-lg"
                variants={itemVariants}
              >
                {movie.Plot}
              </motion.p>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
                variants={itemVariants}
              >
                <motion.div
                  className="flex items-start gap-2"
                  variants={itemVariants}
                >
                  <User className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Director
                    </h3>
                    <p className="text-white">{movie.Director}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-2"
                  variants={itemVariants}
                >
                  <PenTool className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Writer
                    </h3>
                    <p className="text-white">{movie.Writer}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-2"
                  variants={itemVariants}
                >
                  <Users className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Actors
                    </h3>
                    <p className="text-white">{movie.Actors}</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-start gap-2"
                  variants={itemVariants}
                >
                  <Globe className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">
                      Language
                    </h3>
                    <p className="text-white">{movie.Language}</p>
                  </div>
                </motion.div>
                {movie.Awards !== "N/A" && (
                  <motion.div
                    className="sm:col-span-2 flex items-start gap-2"
                    variants={itemVariants}
                  >
                    <Award className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-400">
                        Awards
                      </h3>
                      <p className="text-white">{movie.Awards}</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Data Visualization Section */}
            <motion.div
              className="mt-12"
              variants={itemVariants}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Ratings & Stats
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <MovieRatingChart movie={movie} />
                <MovieGenreChart genres={genres} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
