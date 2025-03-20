import { useQuery } from "@tanstack/react-query";
import { movieService } from "@/app/api";
import { MovieDetail } from "@/types";

export function useMovieDetails(imdbId: string) {
  const { data, isLoading, error } = useQuery<MovieDetail, Error>({
    queryKey: ["movie", imdbId],
    queryFn: () => movieService.getMovieById(imdbId),
    enabled: !!imdbId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    movie: data,
    isLoading,
    error: error ? error.message : null,
  };
}
