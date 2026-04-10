import { publicFetch, tokenManager } from '../../api';

export interface RefreshTokenRequest {
  refreshToken: string;
  expiresInMins?: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await publicFetch<RefreshTokenResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
  });

  // Store new tokens
  await tokenManager.setTokens(response.accessToken, response.refreshToken);

  return response;
}
