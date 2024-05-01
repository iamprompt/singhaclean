export const serialDateTimeToISOString = (serialDateTime: number) => {
  const date = new Date(Date.UTC(0, 0, serialDateTime - 1))

  const fraction = serialDateTime - Math.floor(serialDateTime)
  const milliseconds = Math.round(fraction * 86400 * 1000)
  date.setMilliseconds(milliseconds)
  date.setSeconds(0)

  return date.toISOString()
}
