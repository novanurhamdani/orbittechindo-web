import { create } from "zustand";
import { MovieFilter } from "@/types";

// MovieStore now focuses on UI state and user preferences only
interface MovieStore {
  // Search UI state
  searchQuery: string;
  currentPage: number;
  filter: MovieFilter;

  // Actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setFilter: (filter: Partial<MovieFilter>) => void;
  resetAll: () => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  // Search UI state
  searchQuery: "",
  currentPage: 1,
  filter: {
    type: undefined,
    year: undefined,
  },

  // User preferences
  recentSearches: [],

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setCurrentPage: (page) => set({ currentPage: page }),

  setFilter: (filter) =>
    set((state) => ({
      filter: { ...state.filter, ...filter },
      // Reset to page 1 when filter changes
      currentPage: 1,
    })),

  resetAll: () =>
    set({
      searchQuery: "",
      currentPage: 1,
      filter: {
        type: undefined,
        year: undefined,
      },
    }),
}));
