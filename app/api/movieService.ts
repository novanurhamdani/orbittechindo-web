import apiClient from "./axios";
import { MovieFilter, SearchResponse } from "@/types";

export const movieService = {
  // Search movies by title
  searchMovies: async (
    query: string,
    page = 1,
    filter: MovieFilter = {}
  ): Promise<SearchResponse> => {
    try {
      const params: Record<string, string | number> = {
        s: query,
        page,
      };

      // Add type filter if specified
      if (filter.type) {
        params.type = filter.type;
      }

      // Add year filter if specified
      if (filter.year) {
        params.y = filter.year;
      }

      const response = await apiClient.get<SearchResponse>("", { params });
      return response.data;
    } catch (error) {
      console.error("Error searching movies:", error);
      return {
        Search: [],
        totalResults: "0",
        Response: "False",
        Error: "Failed to fetch movies",
      };
    }
  },

  // Get movie details by ID
  getMovieById: async (id: string) => {
    try {
      const response = await apiClient.get("", {
        params: { i: id, plot: "full" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  },

  // Get featured movies (for carousel)
  getFeaturedMovies: async () => {
    // Get a few featured movies by searching for popular titles identified by IMDb ID
    const featuredTitles = [
      "tt4154796", // Avengers: Endgame
      "tt4415360", // Interstellar
      "tt1490017", // The Lego Movie
      "tt6718170", // The Super Mario Bros. Movie
      "tt4116284", // The Legend Batman
      "tt11032374", // Demon Slayer
    ];

    const promises = featuredTitles.map((title) =>
      apiClient.get<SearchResponse>("", { params: { i: title } })
    );

    try {
      const responses = await Promise.all(promises);

      return responses.map((response) => response.data).filter(Boolean);
    } catch (error) {
      console.error("Error fetching featured movies:", error);
      return [];
    }
  },

  getAllMovies: async (
    page = 1,
    filter: MovieFilter = {}
  ): Promise<SearchResponse> => {
    try {
      const params: Record<string, string | number> = {
        s: "movie",
        page,
      };

      // Add type filter if specified
      if (filter.type) {
        params.type = filter.type;
      }

      // Add year filter if specified
      if (filter.year) {
        params.y = filter.year;
      }

      const response = await apiClient.get<SearchResponse>("", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching all movies:", error);
      return {
        Search: [],
        totalResults: "0",
        Response: "False",
        Error: "Failed to fetch movies",
      };
    }
  },
};

export default movieService;
