import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Web storage using localStorage
const webStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  },
  deleteItem: async (key: string): Promise<void> => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

// Native storage using SecureStore
const nativeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value);
  },
  deleteItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },
};

// Platform-aware storage
const storage = Platform.OS === 'web' ? webStorage : nativeStorage;

// Token management
export const tokenManager = {
  getAccessToken: async (): Promise<string | null> => {
    return await storage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken: async (): Promise<string | null> => {
    return await storage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens: async (accessToken: string, refreshToken: string): Promise<void> => {
    await storage.setItem(ACCESS_TOKEN_KEY, accessToken);
    await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clearTokens: async (): Promise<void> => {
    await storage.deleteItem(ACCESS_TOKEN_KEY);
    await storage.deleteItem(REFRESH_TOKEN_KEY);
  },
};
