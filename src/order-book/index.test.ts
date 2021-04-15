import Pool from '../pool';
import { bookToString, poolToBook } from '.';

const makePool = () => {
  const pool = new Pool();
  pool.add('ABC', 1, 9500, 10, 'abc-1', 'B');
  pool.add('ABC', 1, 10000, 10, 'abc-2', 'B');
  pool.add('ABC', 1, 9900, 10, 'abc-3', 'B');

  pool.add('ABC', 1, 10400, 10, 'abc-4', 'S');
  pool.add('ABC', 1, 10200, 10, 'abc-5', 'S');
  pool.add('ABC', 1, 11000, 10, 'abc-6', 'S');

  pool.add('XYZ', 1, 50000, 10, 'xyz-1', 'S');
  pool.add('XYZ', 1, 49000, 10, 'xyz-2', 'B');
  return pool;
};

describe('poolToBook()', () => {
  it('basic', () => {
    const pool = makePool();

    expect(poolToBook(pool, 'ABC')).toEqual({
      buy: [
        {
          stock: 'ABC',
          locate: 1,
          price: 10000,
          shares: 10,
          reference: 'abc-2',
          side: 'B',
        },
        {
          stock: 'ABC',
          locate: 1,
          price: 9900,
          shares: 10,
          reference: 'abc-3',
          side: 'B',
        },
        {
          stock: 'ABC',
          locate: 1,
          price: 9500,
          shares: 10,
          reference: 'abc-1',
          side: 'B',
        },
      ],
      sell: [
        {
          stock: 'ABC',
          locate: 1,
          price: 10200,
          shares: 10,
          reference: 'abc-5',
          side: 'S',
        },
        {
          stock: 'ABC',
          locate: 1,
          price: 10400,
          shares: 10,
          reference: 'abc-4',
          side: 'S',
        },
        {
          stock: 'ABC',
          locate: 1,
          price: 11000,
          shares: 10,
          reference: 'abc-6',
          side: 'S',
        },
      ],
    });
  });

  it('with limit', () => {
    const pool = makePool();

    expect(poolToBook(pool, 'ABC', 1)).toEqual({
      buy: [
        {
          stock: 'ABC',
          locate: 1,
          price: 10000,
          shares: 10,
          reference: 'abc-2',
          side: 'B',
        },
      ],
      sell: [
        {
          stock: 'ABC',
          locate: 1,
          price: 10200,
          shares: 10,
          reference: 'abc-5',
          side: 'S',
        },
      ],
    });
  });

})

describe('bookToString()', () => {
  it('basic', () => {
    const book = poolToBook(makePool(), 'ABC');
    expect(bookToString(book)).toBe(
      `B 0.95	10
B 0.99	10
B 1	10
-----
S 1.02	10
S 1.04	10
S 1.1	10`)
  })
})
