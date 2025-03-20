import apiClient from "./axios";
import { MovieDetail, SearchResponse, MovieFilter } from "@/types";

export const movieService = {
  // Search movies by title
  searchMovies: async (title: string, page = 1, filter?: MovieFilter) => {
    const params: Record<string, string | number> = {
      s: title,
      page,
    };

    // Add type filter if provided
    if (filter?.type) {
      params.type = filter.type;
    }

    // Add year filter if both start and end are provided
    if (filter?.yearStart && filter?.yearEnd) {
      // OMDb API doesn't support year range directly, so I'll filter on the client side
      // I'll just use the start year as a base filter
      params.y = filter.yearStart;
    }

    const response = await apiClient.get<SearchResponse>("", { params });
    return response.data;
  },

  // Get movie details by ID
  getMovieById: async (imdbId: string) => {
    const params = {
      i: imdbId,
      plot: "full",
    };

    const response = await apiClient.get<MovieDetail>("", { params });
    return response.data;
  },

  // Get featured movies (for carousel)
  getFeaturedMovies: async () => {
    // Since OMDb doesn't have a featured endpoint, we'll use some popular movie titles
    const featuredTitles = [
      "Inception",
      "Interstellar",
      "The Matrix",
      "Avengers",
      "Batman",
      "The Dark Knight Rises",
      "Joker",
      "Captain America",
    ];

    const promises = featuredTitles.map((title) =>
      apiClient.get<SearchResponse>("", { params: { s: title, page: 1 } })
    );

    const responses = await Promise.all(promises);

    // Flatten and take first movie from each search
    return responses
      .map((response) => response.data.Search?.[1])
      .filter((movie) => movie !== undefined);
  },
};

export default movieService;
