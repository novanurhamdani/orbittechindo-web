import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/app/api";

export function useFeaturedMovies() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featuredMovies"],
    queryFn: () => movieService.getFeaturedMovies(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    featuredMovies: data || [],
    isLoading,
    error: error ? (error as Error).message : null,
  };
}
