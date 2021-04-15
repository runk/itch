import Pool from '../pool';
import { poolToBook } from '.';

const makePool = () => {
  const pool = new Pool();
  pool.add('ABC', 1, 95, 10, 'abc-1', 'B');
  pool.add('ABC', 1, 100, 10, 'abc-2', 'B');
  pool.add('ABC', 1, 99, 10, 'abc-3', 'B');

  pool.add('ABC', 1, 104, 10, 'abc-4', 'S');
  pool.add('ABC', 1, 102, 10, 'abc-5', 'S');
  pool.add('ABC', 1, 110, 10, 'abc-6', 'S');

  pool.add('XYZ', 1, 500, 10, 'xyz-1', 'S');
  pool.add('XYZ', 1, 490, 10, 'xyz-2', 'B');
  return pool;
};

test('basic', () => {
  const pool = makePool();

  expect(poolToBook(pool, 'ABC')).toEqual({
    buy: [
      {
        stock: 'ABC',
        locate: 1,
        price: 100,
        shares: 10,
        reference: 'abc-2',
        side: 'B',
      },
      {
        stock: 'ABC',
        locate: 1,
        price: 99,
        shares: 10,
        reference: 'abc-3',
        side: 'B',
      },
      {
        stock: 'ABC',
        locate: 1,
        price: 95,
        shares: 10,
        reference: 'abc-1',
        side: 'B',
      },
    ],
    sell: [
      {
        stock: 'ABC',
        locate: 1,
        price: 102,
        shares: 10,
        reference: 'abc-5',
        side: 'S',
      },
      {
        stock: 'ABC',
        locate: 1,
        price: 104,
        shares: 10,
        reference: 'abc-4',
        side: 'S',
      },
      {
        stock: 'ABC',
        locate: 1,
        price: 110,
        shares: 10,
        reference: 'abc-6',
        side: 'S',
      },
    ],
  });
});

test('with limit', () => {
  const pool = makePool();

  expect(poolToBook(pool, 'ABC', 1)).toEqual({
    sell: [
      {
        stock: 'ABC',
        locate: 1,
        price: 102,
        shares: 10,
        reference: 'abc-5',
        side: 'S',
      },
    ],
    buy: [
      {
        stock: 'ABC',
        locate: 1,
        price: 100,
        shares: 10,
        reference: 'abc-2',
        side: 'B',
      },
    ],
  });
});
