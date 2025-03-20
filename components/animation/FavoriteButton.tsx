"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  size = "md",
  className = "",
}: FavoriteButtonProps) {
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  // Size mapping
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  // Handle animation when favorite status changes
  useEffect(() => {
    if (isFavorite) {
      setIsAnimating(true);
      controls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.4 },
      }).then(() => setIsAnimating(false));
    }
  }, [isFavorite, controls]);

  return (
    <motion.button
      className={`relative flex items-center justify-center rounded-full ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFavorite ? "filled" : "outline"}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {isFavorite && !isAnimating && (
            <motion.div
              animate={controls}
              className="absolute inset-0"
            />
          )}
          <Heart
            className={`${sizeMap[size]} ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-muted-foreground"
            }`}
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
