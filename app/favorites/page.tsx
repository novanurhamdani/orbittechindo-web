"use client";

import { MovieGrid } from "@/components/movies";
import { useAuthStore, useFavoritesStore } from "@/lib/store";
import { PageTransition } from "@/components/animation";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout";
import { Heart, FilmIcon } from "lucide-react";

export default function FavoritesPage() {
  const { favorites } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-600">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Your Favorite Movies
            </h1>
            <p className="text-gray-400 mt-2 max-w-lg">
              Your personally curated collection of movies that you&apos;ve
              marked as favorites
            </p>
          </motion.div>

          {favorites.length > 0 ? (
            <MovieGrid movies={favorites} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16 px-4 glass rounded-xl max-w-md mx-auto"
            >
              <div className="inline-flex items-center justify-center p-4 mb-6 rounded-full bg-black/30 backdrop-blur-sm">
                <FilmIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                No Favorites Yet
              </h3>
              <p className="text-gray-400">
                You haven&apos;t added any movies to your favorites yet. Browse
                movies and click the heart icon to add them here.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/")}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full inline-flex items-center justify-center"
              >
                Discover Movies
              </motion.button>
            </motion.div>
          )}
        </div>
      </PageTransition>
    </MainLayout>
  );
}
