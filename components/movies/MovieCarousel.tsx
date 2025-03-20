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
        setSlidesPerView(5); // 7 slides on xl screens (1280px+)
      } else if (window.innerWidth >= 1024) {
        setSlidesPerView(4); // 6 slides on lg screens (1024px+)
      } else if (window.innerWidth >= 768) {
        setSlidesPerView(2); // 4 slides on md screens (768px+)
      } else if (window.innerWidth >= 640) {
        setSlidesPerView(1); // 3 slides on sm screens (640px+)
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
      {title && (
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-[#D00000] to-[#DC2F02] bg-clip-text text-transparent inline-block">
          {title}
        </h2>
      )}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {movies.map((movie) => {
            const posterUrl =
              movie.Poster !== "N/A" ? movie.Poster : "/images/placeholder.png";

            return (
              <div
                key={movie.imdbID}
                className="relative min-w-0 cursor-pointer px-1 group"
                style={{ flex: `0 0 ${slideWidth}` }}
                onClick={() => router.push(`/movies/${movie.imdbID}`)}
              >
                <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden glass-card">
                  <Image
                    src={posterUrl}
                    alt={movie.Title}
                    fill
                    priority
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 16.67vw, (max-width: 1280px) 14.28vw, 12.5vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030711]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 p-3 w-full backdrop-blur-sm bg-[#030711]/30">
                      <h3 className="text-sm font-bold text-white/90 overflow-hidden">
                        {movie.Title.length > 20
                          ? `${movie.Title.slice(0, 20)}...`
                          : movie.Title}
                      </h3>
                      <p className="text-[#FFBA08] text-xs">{movie.Year}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 glass text-white hover:bg-[#E85D04]/20 hover:text-white z-10 h-10 w-10 rounded-full cursor-pointer"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 glass text-white hover:bg-[#E85D04]/20 hover:text-white z-10 h-10 w-10 rounded-full cursor-pointer"
        onClick={scrollNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
