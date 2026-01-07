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

// This turns a persons full name into a the first name capitalized and truncates there last name into the first letter capitalized

export const firstNameLastInitial = (name: string) => {
  let nameArray = name.split(' ')
  if (!nameArray.length) return 'No Name';

  const first = nameArray[0];
  const last = nameArray[nameArray.length - 1];

  const firstNameCap = first[0].toUpperCase() + first.slice(1);
  const lastNameInitial = last[0].toUpperCase() + '.';

  return `${firstNameCap} ${lastNameInitial}`
}

// This capitalizes the first lestter of a sentence

export const firstLetterCapitalize = (word: string) => {
  let capitalize = [word[0].toLocaleUpperCase()];
  const slice = word.slice(1);
  return capitalize.concat(slice).join('')
}