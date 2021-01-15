import dateFns from 'date-fns'

const { isValid } = dateFns

export function parseDates(dates) {
  let _dates = Array.isArray(dates) ? dates : [dates]
  _dates = _dates.map(parseDate)

  if (_dates.some((date) => !isValid(date))) {
    return null
  }

  return _dates.sort((a, b) => a - b)
}

function parseDate(str = '') {
  let [year, month, date] = String(str).split('-')
  month = month ? month - 1 : 0
  let parts = [year, month, date]
    .filter((part) => part !== undefined)

  return new Date(...parts)
}
