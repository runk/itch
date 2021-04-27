import { timestampToTime } from './utils';
it('works', () => {
  expect(timestampToTime(1000)).toBe('00:00:00.000000001');
  expect(timestampToTime(34244958684803)).toBe('09:30:44.958684803');
  expect(timestampToTime(34244958686571)).toBe('09:30:44.958686571');
  expect(timestampToTime(34265057750724)).toBe('09:31:05.057750724');
  expect(timestampToTime(34265057751385)).toBe('09:31:05.057751385');
  expect(timestampToTime(84265057751385)).toBe('23:24:25.057751385');
});

it('works with precision', () => {
  const precision = 3;
  expect(timestampToTime(1000, precision)).toBe('00:00:00.000');
  expect(timestampToTime(34244958684803, precision)).toBe('09:30:44.959');
  expect(timestampToTime(34244958686571, precision)).toBe('09:30:44.959');
  expect(timestampToTime(34265057750724, precision)).toBe('09:31:05.058');
  expect(timestampToTime(34265057751385, precision)).toBe('09:31:05.058');
  expect(timestampToTime(84265057751385, precision)).toBe('23:24:25.058');

  expect(timestampToTime(34200000000000, precision)).toBe('09:30:00.000');
});
