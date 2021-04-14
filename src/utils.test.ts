import { timestampToTime} from './utils'
it('works', () => {
  expect(timestampToTime(1000)).toBe('00:00:00.000001')
  expect(timestampToTime(34244958684803)).toBe('09:30:44.958684803')
  expect(timestampToTime(34244958686571)).toBe('09:30:44.958686571')
  expect(timestampToTime(34265057750724)).toBe('09:31:05.057750724')
  expect(timestampToTime(34265057751385)).toBe('09:31:05.057751385')
  expect(timestampToTime(84265057751385)).toBe('23:24:25.057751385')
})
