import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Movie } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieCarouselProps {
  movies: Movie[];
}

export function MovieCarousel({ movies }: MovieCarouselProps) {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {movies.map((movie) => {
            const posterUrl =
              movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.png";

            return (
              <div
                key={movie.imdbID}
                className="relative flex-[0_0_100%] min-w-0 cursor-pointer"
                onClick={() => router.push(`/movies/${movie.imdbID}`)}
              >
                <div className="relative aspect-[21/9] w-full">
                  <Image
                    src={posterUrl}
                    alt={movie.Title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                    {movie.Title}
                  </h2>
                  <p className="text-white/80 mb-4">{movie.Year}</p>
                  <Button>View Details</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-10"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-10"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
