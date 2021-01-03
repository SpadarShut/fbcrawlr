import dateFns from 'date-fns'
const { isValid } = dateFns

export function parseDates(dates) {
  const isRange = Array.isArray(dates)
  let _dates = !isRange ? [dates] : dates

  if (_dates.some((date) => !isValid(date))) {
    return null
  }

  return _dates
    .map(parseDate)
    .sort()
}

function parseDate(str = '') {
  let [year, month, date] = String(str).split('-')
  month = month ? month - 1 : 0
  let parts = [year, month, date]
    .filter((part) => part !== undefined)

  let date1 = new Date(...parts)
  return date1
}
