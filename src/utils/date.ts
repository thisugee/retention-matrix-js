export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const timestampToDate = (
  timestamp: number,
  showYear = false
): string => {
  const date = timestamp ? new Date(timestamp * 1000) : new Date()
  const year = date.getFullYear()
  const month = months[date.getMonth()]
  const day = date.getDate()

  return `${month} ${day}${showYear ? `, ${year}` : ''}`
}
