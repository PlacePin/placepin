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