import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Movie } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieCarouselProps {
  movies: Movie[];
  title?: string;
}

export function MovieCarousel({
  movies,
  title = "Featured Movies",
}: MovieCarouselProps) {
  const router = useRouter();
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Update slides per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setSlidesPerView(7); // 7 slides on xl screens (1280px+)
      } else if (window.innerWidth >= 1024) {
        setSlidesPerView(6); // 6 slides on lg screens (1024px+)
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(4); // 4 slides on md screens (768px+)
      } else if (window.innerWidth >= 640) {
        setSlidesPerView(3); // 3 slides on sm screens (640px+)
      } else {
        setSlidesPerView(2); // 2 slides on smaller screens
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!movies || movies.length === 0) {
    return null;
  }

  // Calculate slide width based on slides per view
  const slideWidth = `${100 / slidesPerView}%`;

  return (
    <div className="relative mb-8">
      {title && <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {movies.map((movie) => {
            const posterUrl =
              movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.png";

            return (
              <div
                key={movie.imdbID}
                className="relative min-w-0 cursor-pointer px-1"
                style={{ flex: `0 0 ${slideWidth}` }}
                onClick={() => router.push(`/movies/${movie.imdbID}`)}
              >
                <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden">
                  <Image
                    src={posterUrl}
                    alt={movie.Title}
                    fill
                    priority
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 16.67vw, (max-width: 1280px) 14.28vw, 12.5vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-2 w-full">
                      <h3 className="text-xs font-bold text-white truncate">
                        {movie.Title}
                      </h3>
                      <p className="text-white/80 text-xs">{movie.Year}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-10 h-8 w-8 rounded-full"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 z-10 h-8 w-8 rounded-full"
        onClick={scrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
