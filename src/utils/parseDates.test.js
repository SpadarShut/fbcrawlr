import { parseDates } from './parseDates'

test('parseDates', function () {
  expect(
    parseDates('2020')
  ).toEqual(
    [new Date(2020, 0)]
  )

  expect(
    parseDates(['2020-8', '2020'])
  ).toEqual([
    new Date(2020, 0),
    new Date(2020, 7)
  ])
})
