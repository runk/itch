import { OrderBook } from '.';
import { Order } from '../order';

const makeOrder = (
  stock: string,
  locate: number,
  price: number,
  shares: number,
  reference: string,
  side: string
): Order => ({
  stock,
  locate,
  price,
  shares,
  reference,
  side,
});

const makeBook = (limit?: number) => {
  const book = new OrderBook(limit);
  book.add(makeOrder('ABC', 1, 9500, 10, 'abc-1', 'B'));
  book.add(makeOrder('ABC', 1, 10000, 10, 'abc-2', 'B'));
  book.add(makeOrder('ABC', 1, 9900, 10, 'abc-3', 'B'));

  book.add(makeOrder('ABC', 1, 10400, 10, 'abc-4', 'S'));
  book.add(makeOrder('ABC', 1, 10200, 10, 'abc-5', 'S'));
  book.add(makeOrder('ABC', 1, 11000, 10, 'abc-6', 'S'));

  // book.add(makeOrder('XYZ', 1, 50000, 10, 'xyz-1', 'S'));
  // book.add(makeOrder('XYZ', 1, 49000, 10, 'xyz-2', 'B'));
  return book;
};

describe('constructor()', () => {
  it('basic', () => {
    const book = makeBook();

    expect(book.buy).toEqual([
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
    ]);
    expect(book.sell).toEqual([
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
    ]);
  });

  it('with limit', () => {
    const book = makeBook(1);

    expect(book.buy).toEqual([
      {
        stock: 'ABC',
        locate: 1,
        price: 10000,
        shares: 10,
        reference: 'abc-2',
        side: 'B',
      },
    ]);
    expect(book.sell).toEqual([
      {
        stock: 'ABC',
        locate: 1,
        price: 10200,
        shares: 10,
        reference: 'abc-5',
        side: 'S',
      },
    ]);
  });
});

describe('getSpread()', () => {
  it('works', () => {
    const book = makeBook(1);
    const [bid, ask] = book.getSpread();
    expect(bid).toBe(10000);
    expect(ask).toBe(10200);
  });
});

describe('toString()', () => {
  it('basic', () => {
    const book = makeBook();
    expect(book.toString()).toBe(
      `B 0.95	10
B 0.99	10
B 1	10
-----
S 1.02	10
S 1.04	10
S 1.1	10`
    );
  });
});
