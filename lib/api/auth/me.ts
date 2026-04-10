import { apiFetch } from '../../api';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  refreshToken?: string;
}

export async function getCurrentUser(): Promise<User> {
  return await apiFetch<User>('/auth/me');
}
