export interface DecodedAccessToken {
  email: string;
  userID: string;
  username: string,
  fullName: string,
  accountType: string,
  iat: number;
  exp: number;
}

export interface Address {
  number?: string | null;
  street?: string | null;
  streetType?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  unit?: string | null;
}