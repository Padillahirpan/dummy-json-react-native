import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { User, login as apiLogin, getCurrentUser } from '@/lib/api/auth';
import { tokenManager } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiLogin({ username, password });
      set({
        user: response,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await tokenManager.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      router.replace('/auth/login');
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    set({ isLoading: true });
    try {
      const user = await getCurrentUser();
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // If we can't fetch user, clear auth state
      await tokenManager.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
