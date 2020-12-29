export function parseDates(dates) {
  const isRange = Array.isArray(dates)
  let _dates = !isRange ? [dates] : dates

  return _dates
    .map(parseDate)
    .sort()
    .reverse()
}

function parseDate(str = '') {
  let [year, month, date] = str.split('-')
  month = month ? month - 1 : 0
  let parts = [year, month, date]
    .filter((part) => part !== undefined)

  return new Date(...parts)
}
