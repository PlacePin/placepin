// This util capitalizes the first letter of each word

export function capitalizeWords(string: string) {
  let upperCaseUsername: string | string[] = string.split('')

  upperCaseUsername[0] = upperCaseUsername[0].toLocaleUpperCase()

  for (let i = 0; i < upperCaseUsername.length; i++) {
    if (upperCaseUsername[i - 1] === ' ') {
      upperCaseUsername[i] = upperCaseUsername[i].toLocaleUpperCase()
    }
  }

  return upperCaseUsername = upperCaseUsername.join('')
}

// This maps street types

export const streetTypeMap: Record<string, string> = {
  st: "Street",
  street: "Street",
  ave: "Avenue",
  avenue: "Avenue",
  rd: "Road",
  road: "Road",
  blvd: "Boulevard",
  boulevard: "Boulevard",
  ct: "Court",
  court: "Court",
  ln: "Lane",
  lane: "Lane",
  dr: "Drive",
  drive: "Drive",
  ter: "Terrace",
  terrace: "Terrace",
  pl: "Place",
  place: "Place",
  cir: "Circle",
  circle: "Circle",
  pkwy: "Parkway",
  parkway: "Parkway"
};