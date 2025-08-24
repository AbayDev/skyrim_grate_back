export type AuthTokenResponse = {
  /**
   * Токен доступа
   */
  accessToken: string;
  /**
   * Токен для обновления токена доступа `accessToken`
   */
  refreshToken: string;
};
