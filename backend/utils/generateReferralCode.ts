import crypto from "crypto";

export function generateReferralCode() {
  const uuid = crypto.randomUUID();
  return uuid.split('-').slice(1, 4).join('-');
}