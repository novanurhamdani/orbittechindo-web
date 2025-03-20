import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types";
import { motion } from "framer-motion";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  // Default image if poster is not available
  const posterUrl = movie.Poster !== "N/A" 
    ? movie.Poster 
    : "/images/placeholder.png";

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
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {movie.Type}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
