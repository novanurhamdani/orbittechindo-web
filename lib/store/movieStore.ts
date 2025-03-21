import { create } from "zustand";
import { MovieFilter } from "@/types";

// MovieStore now focuses on UI state and user preferences only
interface MovieStore {
  // Search UI state
  searchQuery: string;
  currentPage: number;
  filter: MovieFilter;

  // User preferences
  recentSearches: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setFilter: (filter: Partial<MovieFilter>) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  resetAll: () => void;
}

// Maximum number of recent searches to store
const MAX_RECENT_SEARCHES = 5;

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

  addRecentSearch: (query) =>
    set((state) => {
      // Don't add empty queries or duplicates
      if (!query.trim() || state.recentSearches.includes(query)) {
        return state;
      }

      // Add to the beginning and limit the size
      const newRecentSearches = [query, ...state.recentSearches].slice(
        0,
        MAX_RECENT_SEARCHES
      );

      return { recentSearches: newRecentSearches };
    }),

  clearRecentSearches: () => set({ recentSearches: [] }),

  resetAll: () =>
    set({
      searchQuery: "",
      currentPage: 1,
      filter: {
        type: undefined,
        year: undefined,
      },
      recentSearches: [],
    }),
}));
