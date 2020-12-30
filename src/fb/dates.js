import fns from 'date-fns'
const { parse, getDay, sub, subDays } = fns

export {
  parseHumanDate,
}

const weekDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

const formats = [
  [
    /just now/i,
    (str, match, ref) => ref,
  ],
  [
    /(\d+)\smins?/i,
    (str, match, ref) => sub(ref, {minutes: match[1]})
  ],
  [
    /(\d+)\shrs?/i,
    (str, match, ref) => sub(ref, {hours: match[1]})
  ],
  [
    /(\d+)\smos?/i,
    (str, match, ref) => sub(ref, {months: match[1]})
  ],
  [
    /on\s(\w+)/i,
    (str, match, ref) => {
      let targetDay = weekDays.findIndex(
        (day) => day.startsWith(match[1].toLowerCase())
      )
      let today = getDay(ref)
      let absDelta = Math.abs(today - targetDay)
      let delta = targetDay >= today ? 7 - absDelta : absDelta

      return subDays(ref, delta)
    }
  ],
  [
    /yesterday\sat\s(\d+):(\d+)\s(am|pm)/i,
    (str, match, ref) => parse(
      str.toLowerCase(),
      '\'yesterday at \'h:mm aa',
      subDays(ref, 1)
    )
  ],
  [
    // December 21 at 4:24 PM
    /(\w)\s(\d+)\sat\s(\d+):(\d+)\s(am|pm)/i,
    'MMMM d \'at\' h:mm aa'
  ],
  [
    // December 16, 2018 at 4:24 PM
    /(\w)\s(\d+),\s(\d+)\sat\s(\d+):(\d+)\s(am|pm)/i,
    'MMMM d, y \'at\' h:mm aa'
  ]
]

function parseHumanDate(dateString, referenceDate = new Date()) {
  if (!dateString){
    throw new Error('First argument must be a string')
  }
  let date = null

  formats.find(([regex, resolver]) => {
    let match = dateString.match(regex)

    if (match) {
      let ref  = new Date(referenceDate)
      // let ref = referenceDate
      if (typeof resolver === 'function') {
        date = resolver(dateString, match, ref)
      }
      else if (typeof resolver === 'string') {
        date = parse(dateString, resolver, ref)
      }
      else {
        throw new Error(`parseHumanDate: resolver missing for ${regex}`)
      }

      return true
    }
  })

  return date
}
