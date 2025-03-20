"use client";

import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { movieService } from "@/app/api";
import { MovieDetail } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { MovieDetail as MovieDetailScreen } from "@/components/movies";
import { PageTransition } from "@/components/animation";
import { motion } from "framer-motion";

export default function MovieDetailPage() {
  const { id } = useParams();
  const movieId = Array.isArray(id) ? id[0] : (id as string);

  // Fetch movie details
  const { data: movie, isLoading } = useQuery<MovieDetail>({
    queryKey: ["movie", movieId],
    queryFn: () => movieService.getMovieById(movieId),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!movieId,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container mx-auto px-4 py-8">
            <motion.div
              className="animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 aspect-[2/3] bg-muted rounded"></div>
                <div className="w-full md:w-2/3">
                  <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  if (!movie) {
    return (
      <MainLayout>
        <PageTransition>
          <motion.div
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
            <p>
              Sorry, we couldn&apos;t find the movie you&apos;re looking for.
            </p>
          </motion.div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <MovieDetailScreen movie={movie} />
      </PageTransition>
    </MainLayout>
  );
}
