"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore, useMovieStore, useFavoritesStore } from "@/lib/store";
import { motion } from "framer-motion";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuthStore();
  const { resetSearch } = useMovieStore();
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
    resetSearch();
  };

  // Animation variants
  const linkVariants = {
    hover: { 
      scale: 1.05,
      color: "hsl(var(--primary))",
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.header 
      className="bg-background border-b sticky top-0 z-10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="/" 
            className="text-2xl font-bold text-primary"
            onClick={handleHomeClick}
          >
            MovieDB
          </Link>
        </motion.div>
        
        <nav className="flex items-center space-x-4">
          <motion.div whileHover="hover" variants={linkVariants}>
            <Link 
              href="/" 
              className={`transition-colors ${pathname === '/' ? 'text-primary font-medium' : 'text-foreground'}`}
              onClick={handleHomeClick}
            >
              Home
            </Link>
          </motion.div>
          
          {isAuthenticated && (
            <motion.div whileHover="hover" variants={linkVariants}>
              <Link 
                href="/favorites" 
                className={`transition-colors flex items-center gap-1 ${pathname === '/favorites' ? 'text-primary font-medium' : 'text-foreground'}`}
              >
                Favorites
                {favorites.length > 0 && (
                  <motion.span 
                    className="inline-flex items-center justify-center w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full"
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
                  variant="outline" 
                  onClick={handleLogout}
                  className="transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  Logout
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover="hover" variants={linkVariants}>
                <Link href="/auth/login" className={`transition-colors ${pathname === '/auth/login' ? 'text-primary font-medium' : 'text-foreground'}`}>
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild>
                  <Link href="/auth/register">Register</Link>
                </Button>
              </motion.div>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
