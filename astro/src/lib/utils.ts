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
