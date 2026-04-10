import { publicFetch, tokenManager } from '../../api';

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await publicFetch<{ token: string } & LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials),
    }
  );

  // Store tokens securely
  await tokenManager.setTokens(response.accessToken, response.refreshToken);

  return response;
}
