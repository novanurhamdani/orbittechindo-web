"use client";

import { PageTransition } from "@/components/animation";
import { MovieGrid } from "@/components/movies";
import { useAuthStore, useFavoritesStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <PageTransition>
      <div className="container py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8"
        >
          Your Favorite Movies
        </motion.h1>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground mb-4">
              You haven&apos;t added any movies to your favorites yet.
            </p>
            <p className="text-muted-foreground">
              Browse movies and click the heart icon to add them to your favorites.
            </p>
          </motion.div>
        ) : (
          <MovieGrid movies={favorites} />
        )}
      </div>
    </PageTransition>
  );
}
