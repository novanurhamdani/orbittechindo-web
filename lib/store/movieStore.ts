import { create } from "zustand";
import { Movie, MovieFilter } from "@/types";

interface MovieStore {
  searchQuery: string;
  searchResults: Movie[];
  totalResults: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  filter: MovieFilter;

  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Movie[], total: number) => void;
  setCurrentPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilter: (filter: Partial<MovieFilter>) => void;
  resetSearch: () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  searchQuery: "",
  searchResults: [],
  totalResults: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  filter: {
    type: undefined,
    yearStart: 1900,
    yearEnd: new Date().getFullYear(),
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSearchResults: (results, total) =>
    set({ searchResults: results, totalResults: total }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
    })),

  resetSearch: () =>
    set({
      searchQuery: "",
      searchResults: [],
      totalResults: 0,
      currentPage: 1,
      error: null,
      filter: {
        type: undefined,
        yearStart: 1900,
        yearEnd: new Date().getFullYear(),
      },
    }),
}));
