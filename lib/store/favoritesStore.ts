import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/types';

interface FavoritesState {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (movie) => {
        const { favorites } = get();
        if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
          set({ favorites: [...favorites, movie] });
        }
      },
      
      removeFavorite: (id) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(movie => movie.imdbID !== id) });
      },
      
      toggleFavorite: (movie) => {
        const { favorites, addFavorite, removeFavorite } = get();
        const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
        
        if (isFavorite) {
          removeFavorite(movie.imdbID);
        } else {
          addFavorite(movie);
        }
      },
      
      isFavorite: (id) => {
        const { favorites } = get();
        return favorites.some(movie => movie.imdbID === id);
      }
    }),
    {
      name: 'movie-favorites',
    }
  )
);
