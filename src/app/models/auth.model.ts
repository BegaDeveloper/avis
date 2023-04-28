export class AuthenticateResponse {
  constructor(
    public accessToken: string,
    public refreshToken: string,
    public accessTokenValidUntil: Date,
    public refreshTokenValidUntil: Date,
    public user: any,
  ) {}
}
