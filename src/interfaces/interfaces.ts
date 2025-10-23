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
  number: string;
  street: string;
  streetType: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
}
