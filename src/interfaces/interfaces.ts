export interface DecodedAccessToken {
  email: string;
  userID: string;
  username: string,
  fullName: string,
  iat: number;
  exp: number;
}