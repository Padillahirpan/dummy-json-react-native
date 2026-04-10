import { router } from 'expo-router';
import { tokenManager as storageTokenManager } from './storage';

const API_BASE = 'https://dummyjson.com';

// Re-export tokenManager for use in other modules
export const tokenManager = storageTokenManager;

// API error class
export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Base fetch wrapper with auth and error handling
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = await tokenManager.getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth header if token exists
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Required by dummyjson for cookies
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired
      if (response.status === 401) {
        await tokenManager.clearTokens();
        router.replace('/auth/login');
        throw new ApiError('Session expired. Please login again.', 401);
      }
      throw new ApiError(data.message || 'API request failed', response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Network error');
  }
}

// Public fetch (no auth required)
export async function publicFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Required by dummyjson
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(data.message || 'API request failed', response.status, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : 'Network error');
  }
}
