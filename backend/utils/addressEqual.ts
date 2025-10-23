import { type Address } from "../../src/interfaces/interfaces";
import { streetTypeMap } from '../../src/utils/stringUtils';

// Normalize a string: trim, collapse spaces, lowercase (used internally)
function normalizePart(str: string): string {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}

// Normalize street type using map
function normalizeStreetType(type: string): string | null {
  const key = normalizePart(type);
  return streetTypeMap[key] || null;
}

// Validate individual address components
export function validateAddress(addr: Address): boolean {
  if (!addr.number || !addr.street || !addr.streetType || !addr.city || !addr.state || !addr.zip) {
    return false;
  }

  const normalizedType = normalizeStreetType(addr.streetType);
  if (!normalizedType) return false;

  if (!/^\d+[A-Za-z]?$/.test(addr.number)) return false; // allow numbers like 12 or 12B
  if (!/^[A-Za-z\s]+$/.test(addr.street)) return false; // street letters
  if (!/^[A-Za-z\s]+$/.test(addr.city)) return false; // city letters
  if (!/^[A-Z]{2}$/.test(addr.state.toUpperCase())) return false; // 2-letter state
  if (!/^\d{5}(-\d{4})?$/.test(addr.zip)) return false; // ZIP or ZIP+4

  if (addr.unit && !/^[A-Za-z0-9\s#\-]+$/.test(addr.unit)) return false; // unit optional, allow #, letters, numbers

  return true;
}

// Normalize address: capitalization, remove extra spaces, normalize streetType
export function normalizeAddress(addr: Address): Address {
  const cap = (s: string) =>
    s
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(w => w[0].toUpperCase() + w.slice(1))
      .join(' ');

  return {
    number: addr.number.trim(),
    street: cap(addr.street.trim()),
    streetType: normalizeStreetType(addr.streetType)!,
    unit: addr.unit ? addr.unit.trim() : undefined,
    city: cap(addr.city.trim()),
    state: addr.state.toUpperCase(),
    zip: addr.zip.trim(),
  };
}

// Compare two addresses for equivalence
export function addressesEqual(a1: Address | null, a2: Address | null): boolean {
  if (!a1 || !a2) return false;

  const n1 = normalizeAddress(a1);
  const n2 = normalizeAddress(a2);

  return (
    n1.number.toLowerCase() === n2.number.toLowerCase() &&
    n1.street.toLowerCase() === n2.street.toLowerCase() &&
    n1.streetType.toLowerCase() === n2.streetType.toLowerCase() &&
    (n1.unit || '').toLowerCase() === (n2.unit || '').toLowerCase() &&
    n1.city.toLowerCase() === n2.city.toLowerCase() &&
    n1.state === n2.state &&
    n1.zip === n2.zip
  );
}
