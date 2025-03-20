import Image from "next/image";
import { MovieDetail as MovieDetailType } from "@/types";
import { formatGenres } from "@/lib/utils/format";
import { MovieRatingChart } from "./MovieRatingChart";
import { MovieGenreChart } from "./MovieGenreChart";
import { motion } from "framer-motion";
import { FavoriteButton } from "@/components/animation";
import { useAuthStore, useFavoritesStore } from "@/lib/store";

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
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Movie poster */}
          <motion.div
            className="md:col-span-1 relative"
            variants={itemVariants}
          >
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

            {isAuthenticated && (
              <motion.div
                className="absolute top-4 right-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <FavoriteButton
                  isFavorite={isMovieFavorite}
                  onToggle={() => toggleFavorite(movie)}
                  size="lg"
                  className="bg-background/80 backdrop-blur-sm"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Movie info */}
          <motion.div className="p-6 md:col-span-2" variants={itemVariants}>
            <motion.h1
              className="text-3xl font-bold mb-2"
              variants={itemVariants}
            >
              {movie.Title}
            </motion.h1>

            <motion.div
              className="flex flex-wrap gap-2 mb-4"
              variants={itemVariants}
            >
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {movie.Year}
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {movie.Rated}
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {movie.Runtime}
              </span>
            </motion.div>

            <motion.div className="mb-6" variants={itemVariants}>
              <motion.div
                className="flex flex-wrap gap-2 mb-4"
                variants={itemVariants}
              >
                {genres.map((genre, index) => (
                  <motion.span
                    key={genre}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {genre}
                  </motion.span>
                ))}
              </motion.div>

              <motion.p
                className="text-muted-foreground mb-4"
                variants={itemVariants}
              >
                {movie.Plot}
              </motion.p>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                variants={itemVariants}
              >
                <motion.div variants={itemVariants}>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Director
                  </h3>
                  <p>{movie.Director}</p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Writer
                  </h3>
                  <p>{movie.Writer}</p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Actors
                  </h3>
                  <p>{movie.Actors}</p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Language
                  </h3>
                  <p>{movie.Language}</p>
                </motion.div>
                {movie.Awards !== "N/A" && (
                  <motion.div className="sm:col-span-2" variants={itemVariants}>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Awards
                    </h3>
                    <p>{movie.Awards}</p>
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
              <h2 className="text-xl font-semibold mb-6">Ratings & Stats</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
