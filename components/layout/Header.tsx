"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore, useMovieStore, useFavoritesStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Home, Heart, LogOut, LogIn, UserPlus, Film } from "lucide-react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();
  const { resetAll } = useMovieStore();
  const { favorites } = useFavoritesStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleHomeClick = () => {
    resetAll();
  };

  // Animation variants
  const linkVariants = {
    hover: {
      scale: 1.05,
      color: "hsl(var(--primary))",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.header
      className="bg-background/40 backdrop-blur-md sticky top-0 z-10 shadow-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2"
        >
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent flex items-center gap-2"
            onClick={handleHomeClick}
          >
            <Film className="h-6 w-6 text-red-500" />
            <span>MovieDB</span>
          </Link>
        </motion.div>

        <nav className="flex items-center space-x-4">
          <motion.div whileHover="hover" variants={linkVariants}>
            <Link
              href="/"
              className={`transition-colors flex items-center gap-1 px-3 py-2 rounded-md ${
                pathname === "/"
                  ? "bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium"
                  : "text-gray-300 hover:bg-white/5"
              }`}
              onClick={handleHomeClick}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </motion.div>

          {isAuthenticated && (
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link
                href="/favorites"
                className={`transition-colors flex items-center gap-1 px-3 py-2 rounded-md ${
                  pathname === "/favorites"
                    ? "bg-gradient-to-r from-red-600 to-amber-600 text-white font-medium"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <Heart className="h-4 w-4" />
                <span>Favorites</span>
                {favorites.length > 0 && (
                  <motion.span
                    className="inline-flex items-center justify-center w-5 h-5 text-xs bg-white text-red-600 rounded-full font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    {favorites.length}
                  </motion.span>
                )}
              </Link>
            </motion.div>
          )}

          {isAuthenticated ? (
            <>
              <motion.div whileHover="hover" variants={linkVariants}>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="transition-all hover:bg-red-500/10 text-gray-300 hover:text-red-500 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover="hover" variants={linkVariants}>
                <Link
                  href="/auth/login"
                  className={`transition-colors flex items-center gap-1 px-3 py-2 rounded-md ${
                    pathname === "/auth/login"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/auth/register"
                  className={`transition-colors flex items-center gap-1 px-3 py-2 rounded-md ${
                    pathname === "/auth/register"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </motion.div>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
