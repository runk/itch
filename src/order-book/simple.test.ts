import { SimpleOrderBook } from './simple';
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
  const book = new SimpleOrderBook(limit);
  book.add('S', 10000, 500);
  book.add('S', 10000, 1000);
  book.add('S', 10500, 2000);
  book.add('B', 9900, 5000);
  book.add('B', 9100, 4000);
  book.add('B', 9000, 1000);
  return book;
};

describe('constructor()', () => {
  it('basic', () => {
    const book = makeBook();

    expect(book.buy).toMatchInlineSnapshot(`
      Map {
        9900 => 5000,
        9100 => 4000,
        9000 => 1000,
      }
    `);
    expect(book.sell).toMatchInlineSnapshot(`
      Map {
        10000 => 1500,
        10500 => 2000,
      }
    `);
  });
});

// describe('getSpread()', () => {
//   it('works', () => {
//     const book = makeBook(1);
//     const [bid, ask] = book.getSpread();
//     expect(bid).toBe(10000);
//     expect(ask).toBe(10200);
//   });
// });

describe('toString()', () => {
  it('basic', () => {
    const book = makeBook();
    expect(book.toString()).toMatchInlineSnapshot(`
      "B 0.90: 1000
      B 0.91: 4000
      B 0.99: 5000
      -----
      S 1.00: 1500
      S 1.05: 2000
      "
    `);
  });
});
