export const streetTypeMap: Record<string, string> = {
  st: "street",
  street: "street",
  ave: "avenue",
  avenue: "avenue",
  rd: "road",
  road: "road",
  blvd: "boulevard",
  boulevard: "boulevard",
  ct: "court",
  court: "court",
  ln: "lane",
  lane: "lane",
  dr: "drive",
  drive: "drive",
  ter: "terrace",
  terrace: "terrace",
  pl: "place",
  place: "place",
  cir: "circle",
  circle: "circle",
  pkwy: "parkway",
  parkway: "parkway",
  way: "way",
  hwy: "highway",
  highway: "highway"
};

export const stateMap: Record<string, string> = {
  al: "alabama", alabama: "alabama",
  ak: "alaska", alaska: "alaska",
  az: "arizona", arizona: "arizona",
  ar: "arkansas", arkansas: "arkansas",
  ca: "california", california: "california",
  co: "colorado", colorado: "colorado",
  ct: "connecticut", connecticut: "connecticut",
  de: "delaware", delaware: "delaware",
  fl: "florida", florida: "florida",
  ga: "georgia", georgia: "georgia",
  hi: "hawaii", hawaii: "hawaii",
  id: "idaho", idaho: "idaho",
  il: "illinois", illinois: "illinois",
  in: "indiana", indiana: "indiana",
  ia: "iowa", iowa: "iowa",
  ks: "kansas", kansas: "kansas",
  ky: "kentucky", kentucky: "kentucky",
  la: "louisiana", louisiana: "louisiana",
  me: "maine", maine: "maine",
  md: "maryland", maryland: "maryland",
  ma: "massachusetts", massachusetts: "massachusetts",
  mi: "michigan", michigan: "michigan",
  mn: "minnesota", minnesota: "minnesota",
  ms: "mississippi", mississippi: "mississippi",
  mo: "missouri", missouri: "missouri",
  mt: "montana", montana: "montana",
  ne: "nebraska", nebraska: "nebraska",
  nv: "nevada", nevada: "nevada",
  nh: "new hampshire", "new hampshire": "new hampshire",
  nj: "new jersey", "new jersey": "new jersey",
  nm: "new mexico", "new mexico": "new mexico",
  ny: "new york", "new york": "new york",
  nc: "north carolina", "north carolina": "north carolina",
  nd: "north dakota", "north dakota": "north dakota",
  oh: "ohio", ohio: "ohio",
  ok: "oklahoma", oklahoma: "oklahoma",
  or: "oregon", oregon: "oregon",
  pa: "pennsylvania", pennsylvania: "pennsylvania",
  ri: "rhode island", "rhode island": "rhode island",
  sc: "south carolina", "south carolina": "south carolina",
  sd: "south dakota", "south dakota": "south dakota",
  tn: "tennessee", tennessee: "tennessee",
  tx: "texas", texas: "texas",
  ut: "utah", utah: "utah",
  vt: "vermont", vermont: "vermont",
  va: "virginia", virginia: "virginia",
  wa: "washington", washington: "washington",
  wv: "west virginia", "west virginia": "west virginia",
  wi: "wisconsin", wisconsin: "wisconsin",
  wy: "wyoming", wyoming: "wyoming",
  dc: "district of columbia", "district of columbia": "district of columbia"
};

/**
 * Normalizes a street address by:
 * - Converting to lowercase
 * - Trimming whitespace
 * - Standardizing street types (St -> street, Ave -> avenue)
 * - Removing extra spaces
 */
export const normalizeStreet = (street: string): string => {
  const normalized = street.toLowerCase().trim();
  const words = normalized.split(/\s+/);
  
  // Check if last word is a street type and standardize it
  if (words.length > 1) {
    const lastWord = words[words.length - 1].replace(/\./g, ''); // Remove periods
    if (streetTypeMap[lastWord]) {
      words[words.length - 1] = streetTypeMap[lastWord];
    }
  }
  
  return words.join(' ');
};

/**
 * Normalizes a state by converting abbreviations to full names
 * MA -> massachusetts, Massachusetts -> massachusetts
 */
export const normalizeState = (state: string): string => {
  const normalized = state.toLowerCase().trim();
  return stateMap[normalized] || normalized;
};

/**
 * Normalizes an entire address object for consistent comparison
 */
export const normalizeAddress = (address: {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
}) => {
  return {
    street: normalizeStreet(address.street),
    unit: address.unit?.toLowerCase().trim() || undefined,
    city: address.city.toLowerCase().trim(),
    state: normalizeState(address.state),
    zip: address.zip.trim()
  };
};

/**
 * Compares two addresses for equality
 */
export const addressesEqual = (addr1: any, addr2: any): boolean => {
  const norm1 = normalizeAddress(addr1);
  const norm2 = normalizeAddress(addr2);
  
  return (
    norm1.street === norm2.street &&
    norm1.city === norm2.city &&
    norm1.state === norm2.state &&
    norm1.zip === norm2.zip
  );
};