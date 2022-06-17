import { timestampToTime } from './utils';
import test from 'ava';

test('works', (t) => {
  t.is(timestampToTime(1000), '00:00:00.000000001');
  t.is(timestampToTime(34244958684803), '09:30:44.958684803');
  t.is(timestampToTime(34244958686571), '09:30:44.958686571');
  t.is(timestampToTime(34265057750724), '09:31:05.057750724');
  t.is(timestampToTime(34265057751385), '09:31:05.057751385');
  t.is(timestampToTime(84265057751385), '23:24:25.057751385');
});

test('works with precision', (t) => {
  const precision = 3;
  t.is(timestampToTime(1000, precision), '00:00:00.000');
  t.is(timestampToTime(34244958684803, precision), '09:30:44.959');
  t.is(timestampToTime(34244958686571, precision), '09:30:44.959');
  t.is(timestampToTime(34265057750724, precision), '09:31:05.058');
  t.is(timestampToTime(34265057751385, precision), '09:31:05.058');
  t.is(timestampToTime(84265057751385, precision), '23:24:25.058');

  t.is(timestampToTime(34200000000000, precision), '09:30:00.000');
});
