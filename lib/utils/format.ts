import { MovieDetail } from "@/types";

// Format movie genres into an array
export function formatGenres(genreString: string): string[] {
  return genreString.split(",").map((genre) => genre.trim());
}

// Extract genre data for charts
export function extractGenreData(
  movie: MovieDetail
): { name: string; count: number }[] {
  const genres = formatGenres(movie.Genre);

  // For a single movie, each genre has a count of 1
  return genres.map((genre) => ({
    name: genre,
    count: 1,
  }));
}

// Extract rating data for charts
export function extractRatingData(
  movie: MovieDetail
): { name: string; value: number }[] {
  return movie.Ratings.map((rating) => {
    let value = 0;

    // Convert different rating formats to a 0-10 scale
    if (rating.Source === "Internet Movie Database") {
      // IMDb is already on a 0-10 scale
      value = parseFloat(rating.Value.split("/")[0]);
    } else if (rating.Source === "Rotten Tomatoes") {
      // Rotten Tomatoes is on a 0-100% scale
      value = parseInt(rating.Value.replace("%", "")) / 10;
    } else if (rating.Source === "Metacritic") {
      // Metacritic is on a 0-100 scale
      value = parseInt(rating.Value.split("/")[0]) / 10;
    }

    return {
      name: rating.Source,
      value,
    };
  });
}

// Format runtime to minutes
export function formatRuntime(runtime: string): number {
  const match = runtime.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}
