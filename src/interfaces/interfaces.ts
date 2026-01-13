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

export interface Receipt {
  id: string;
  amount: number;
  date: string;
  expenseCategory: string;
  paymentMethod: string;
  description: string;
}

interface PerkData {
  month: number;
  year: number;
  count: number;
}

export interface PerkPatterns {
  food: PerkData[];
  laundry: PerkData[];
  housekeeping: PerkData[];
  other: PerkData[];
}