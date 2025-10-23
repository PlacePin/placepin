import { type Address } from "../../src/interfaces/interfaces";
import { streetTypeMap } from "../../src/utils/stringUtils";

// --- Helpers ---
const norm = (v?: string | null) => v?.trim().toLowerCase() ?? "";
const cap = (s?: string | null) =>
  (s ?? "")
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");

// Normalize a string: trim, collapse spaces, lowercase (used internally)    
function normalizePart(str?: string | null): string {
  return norm(str).replace(/\s+/g, " ");
}

// Normalize street type using map
function normalizeStreetType(type?: string | null): string | null {
  const key = normalizePart(type);
  return streetTypeMap[key] || null;
}

// Validate individual address components
export function validateAddress(addr: Address): boolean {
  if (!addr) return false;

  const { number, street, streetType, city, state, zip, unit } = addr;
  if (!number || !street || !streetType || !city || !state || !zip) return false;

  if (!normalizeStreetType(streetType)) return false;
  if (!/^\d+[A-Za-z]?$/.test(number)) return false;
  if (!/^[A-Za-z\s]+$/.test(street)) return false;
  if (!/^[A-Za-z\s]+$/.test(city)) return false;
  if (!/^[A-Z]{2}$/.test(state.toUpperCase())) return false;
  if (!/^\d{5}(-\d{4})?$/.test(zip)) return false;
  if (unit && !/^[A-Za-z0-9\s#\-]+$/.test(unit)) return false;

  return true;
}

// Normalize address: capitalization, remove extra spaces, normalize streetType
export function normalizeAddress(addr: Address): Address {
  return {
    number: norm(addr.number),
    street: cap(addr.street),
    streetType: normalizeStreetType(addr.streetType) ?? "",
    unit: addr.unit ? addr.unit.trim() : "",
    city: cap(addr.city),
    state: norm(addr.state).toUpperCase(),
    zip: norm(addr.zip),
  };
}

// Compare two addresses for equivalence
export function addressesEqual(a1: Address | null, a2: Address | null): boolean {
  if (!a1 || !a2) return false;

  const n1 = normalizeAddress(a1);
  const n2 = normalizeAddress(a2);

  return (
    norm(n1.number) === norm(n2.number) &&
    norm(n1.street) === norm(n2.street) &&
    norm(n1.streetType) === norm(n2.streetType) &&
    norm(n1.unit) === norm(n2.unit) &&
    norm(n1.city) === norm(n2.city) &&
    n1.state === n2.state &&
    norm(n1.zip) === norm(n2.zip)
  );
}
