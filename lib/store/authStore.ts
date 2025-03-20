import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState, LoginCredentials, RegisterData, User } from "@/types";
import { authService } from "@/app/api";

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        try {
          const { user, token } = await authService.login(credentials);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error("Login error:", error);
          throw error;
        }
      },

      register: async (data) => {
        try {
          const { user, token } = await authService.register(data);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error("Registration error:", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          set({ user: null, token: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout error:", error);
          throw error;
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token });
      },
    }),
    {
      name: "auth-storage",
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
