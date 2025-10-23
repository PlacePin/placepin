import type { Address } from '../../src/interfaces/interfaces';
import { streetTypeMap } from '../../src/utils/stringUtils';

function extractStateZip(segment: string) {
  // Look for "MA 02136" or "MA,02136" or "MA02136"
  const cleaned = segment.replace(/\s+/g, ' ').trim();
  // Try common patterns
  const m1 = cleaned.match(/([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/); // "MA 02136"
  if (m1) return { state: m1[1].toUpperCase(), zip: m1[2] };
  const m2 = cleaned.match(/(\d{5}(?:-\d{4})?)$/); // just zip at end
  if (m2) {
    // no state found here
    return { state: null, zip: m2[1] };
  }
  // maybe segment is exactly a ZIP
  const m3 = cleaned.match(/^(\d{5}(?:-\d{4})?)$/);
  if (m3) return { state: null, zip: m3[1] };
  return { state: null, zip: null };
}

export function parseAddress(addressStr: string): Address | null {
  if (!addressStr) return null;

  // 1) split by commas into segments (preserve order)
  const segments = addressStr
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  if (segments.length === 0) return null;

  // normalize all segments spacing & periods
  for (let i = 0; i < segments.length; i++) {
    segments[i] = segments[i].replace(/\./g, '').replace(/\s+/g, ' ').trim();
  }

  // 2) Try to locate state+zip
  let state: string | null = null;
  let zip: string | null = null;
  let citySegmentIndex = -1;

  // Case A: last segment contains state+zip (e.g., "MA 02136")
  const last = segments[segments.length - 1];
  const tryLast = extractStateZip(last);
  if (tryLast.zip && tryLast.state) {
    state = tryLast.state;
    zip = tryLast.zip;
    // city is everything between first segment and last segment
    citySegmentIndex = segments.length - 2; // city likely in the segment before last
  } else if (tryLast.zip && !tryLast.state) {
    // last segment is just ZIP -> look to previous segment for state+city
    zip = tryLast.zip;
    if (segments.length >= 2) {
      const prev = segments[segments.length - 2];
      // try to extract state from end of prev (e.g., "Boston MA")
      const m = prev.match(/(.*)\s+([A-Za-z]{2})\s*$/);
      if (m) {
        citySegmentIndex = segments.length - 2;
        state = m[2].toUpperCase();
        // replace the prev segment with the city-only part (we'll pull city from it)
        segments[segments.length - 2] = m[1].trim();
      } else {
        // Maybe prev contains both city and state+zip together, or it's "Boston MA 02136" without comma.
        // Try to parse state+zip within prev
        const tryPrev = extractStateZip(prev);
        if (tryPrev.zip && tryPrev.state) {
          state = tryPrev.state;
          zip = tryPrev.zip;
          citySegmentIndex = segments.length - 3 >= 0 ? segments.length - 3 : -1;
        } else {
          // fallback: treat prev as city and leave state null (will invalidate later if missing)
          citySegmentIndex = segments.length - 2;
        }
      }
    }
  } else {
    // last segment contains neither zip nor state -> maybe last two tokens across segments
    // try to join last two segments and extract state+zip
    if (segments.length >= 2) {
      const joined = (segments[segments.length - 2] + ' ' + segments[segments.length - 1]).trim();
      const tryJoined = extractStateZip(joined);
      if (tryJoined.zip && tryJoined.state) {
        state = tryJoined.state;
        zip = tryJoined.zip;
        citySegmentIndex = segments.length - 3 >= 0 ? segments.length - 3 : -1;
      }
    }
  }

  // If still missing zip or state, try to find tokens at the end of the entire input
  if (!zip || !state) {
    const tokens = addressStr.replace(/,/g, ' ').replace(/\s+/g, ' ').trim().split(' ');
    // last token ZIP?
    const lastToken = tokens[tokens.length - 1];
    if (!zip && /^\d{5}(?:-\d{4})?$/.test(lastToken)) {
      zip = lastToken;
      // state might be previous token
      const prevToken = tokens[tokens.length - 2];
      if (!state && /^[A-Za-z]{2}$/.test(prevToken)) {
        state = prevToken.toUpperCase();
      }
    }
  }

  if (!zip) return null; // without zip it's hard to continue reliably
  if (!state) return null; // require state for U.S. addresses here

  // City detection:
  // If we found a city segment index, use that. Otherwise, infer city from the segments between the first (street) and the state/zip segment.
  let city = '';
  if (citySegmentIndex >= 0 && citySegmentIndex < segments.length) {
    city = segments
      .slice(1, citySegmentIndex + 1)
      .join(' ')
      .trim();
  } else {
    // fallback: everything between first segment and the last that contained state/zip
    if (segments.length >= 3) {
      city = segments.slice(1, segments.length - 1).join(' ').trim();
    } else {
      city = '';
    }
  }

  // 3) Parse the first segment -> number, street name, street type, unit (optional)
  const first = segments[0]; // e.g., "192 reservation road 3"
  const firstTokens = first.split(' ').filter(Boolean);

  if (firstTokens.length < 2) return null; // need at least a number + street

  // street number is first token (allow numbers and numbers with suffix like "12B")
  const number = firstTokens[0];

  // find street type index in firstTokens (scan tokens after the number)
  let streetTypeTokenIndex = -1;
  for (let i = 1; i < firstTokens.length; i++) {
    const w = firstTokens[i].toLowerCase().replace(/\./g, '');
    if (streetTypeMap[w]) {
      streetTypeTokenIndex = i;
      break;
    }
  }

  if (streetTypeTokenIndex === -1) {
    // no street type found in the first segment -> attempt to search more liberally
    // try last token in first segment
    const lastTok = firstTokens[firstTokens.length - 1].toLowerCase().replace(/\./g, '');
    if (streetTypeMap[lastTok]) {
      streetTypeTokenIndex = firstTokens.length - 1;
    } else {
      return null; // cannot find street type -> invalid/malformed
    }
  }

  const streetWords = firstTokens.slice(1, streetTypeTokenIndex);
  const street = streetWords.join(' ').trim();
  const streetTypeKey = firstTokens[streetTypeTokenIndex].toLowerCase().replace(/\./g, '');
  const streetType = streetTypeMap[streetTypeKey] || streetTypeMap[streetTypeKey.replace(/\./g, '')] || firstTokens[streetTypeTokenIndex];

  // unit is everything after streetType in the first segment (if any)
  let unit: string | undefined = undefined;
  if (streetTypeTokenIndex + 1 < firstTokens.length) {
    unit = firstTokens.slice(streetTypeTokenIndex + 1).join(' ').trim();
    if (unit === '') unit = undefined;
  }

  // final cleanup: if city is empty try to infer from segments (some inputs put city and state in same segment)
  if ((!city || city.length === 0) && segments.length >= 2) {
    // maybe the second segment includes city + state (e.g., "Boston MA")
    const maybe = segments[1];
    const m = maybe.match(/(.*)\s+([A-Za-z]{2})$/);
    if (m) city = m[1].trim();
  }

  // normalize capitalization
  const cap = (s: string) =>
    s
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(w => w[0] ? w[0].toUpperCase() + w.slice(1) : w)
      .join(' ');

  return {
    number: number,
    street: cap(street),
    streetType: typeof streetType === 'string' ? streetType : cap(String(streetType)),
    unit: unit ? unit : undefined,
    city: cap(city),
    state: state.toUpperCase(),
    zip
  };
}