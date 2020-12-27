import { parseHumanDate } from '../dates'

test('parseHumanDate', () => {
  const referenceDate = new Date(Date.UTC(2020, 11, 25, 12, 0, 0, 0));

  expect(
    referenceDate.toISOString()
  ).toBe(
    '2020-12-25T12:00:00.000Z'
  );
  [
    ['Just now', '2020-12-25T12:00:00.000Z'],
    ['1 min',    '2020-12-25T11:59:00.000Z'],
    ['5 mins',   '2020-12-25T11:55:00.000Z'],
    ['1 hr',     '2020-12-25T11:00:00.000Z'],
    ['10 hrs',   '2020-12-25T02:00:00.000Z'],
    ['on Mon',   '2020-12-21T12:00:00.000Z'],
    ['on Sun',   '2020-12-20T12:00:00.000Z'],
    ['Yesterday at 2:51 PM',         '2020-12-24T14:51:00.000Z'],
    ['December 21 at 4:24 PM',       '2020-12-21T16:24:00.000Z'],
    ['December 16, 2018 at 4:24 PM', '2018-12-16T16:24:00.000Z'],
  ].forEach(([input, output]) => {
    expect(
      input + ' - ' + parseHumanDate(input, referenceDate).toISOString()
    ).toBe(
      input + ' - ' + output
    )
  })

  expect(parseHumanDate('sponsored', referenceDate)).toBe(null)
})
