export interface DecodedAccessToken {
  email: string;
  userID: string;
  username: string,
  fullName: string,
  accountType: string,
  iat: number;
  exp: number;
}