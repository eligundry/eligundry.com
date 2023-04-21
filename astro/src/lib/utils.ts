export function readingTimeToFancyBackgroundPoints(minutes: number) {
  let fancyBackgroundPoints = 30

  if (minutes >= 16) {
    fancyBackgroundPoints = 180
  } else if (minutes >= 12) {
    fancyBackgroundPoints = 120
  } else if (minutes >= 8) {
    fancyBackgroundPoints = 60
  } else if (minutes <= 2) {
    fancyBackgroundPoints = 15
  }

  return fancyBackgroundPoints
}

export function convertNumberToOrdinal(n: number) {
  let ord = 'th'

  if (n % 10 === 1 && n % 100 !== 11) {
    ord = 'st'
  } else if (n % 10 === 2 && n % 100 !== 12) {
    ord = 'nd'
  } else if (n % 10 === 3 && n % 100 !== 13) {
    ord = 'rd'
  }

  return n + ord
}
