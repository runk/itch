import OrderBook from '.';
import test from 'ava';

const makeBook = (limit?: number) => {
  const book = new OrderBook(limit);
  book.add('S', 10000, 500);
  book.add('S', 10000, 1000);
  book.add('S', 10500, 2000);
  book.add('B', 9900, 5000);
  book.add('B', 9100, 4000);
  book.add('B', 9000, 1000);
  return book;
};

test('basic', (t) => {
  const book = makeBook();

  t.deepEqual(
    book.buy,
    new Map([
      [9900, 5000],
      [9100, 4000],
      [9000, 1000],
    ]),
  );
  t.deepEqual(
    book.sell,
    new Map([
      [10000, 1500],
      [10500, 2000],
    ]),
  );
});

test('getSpread()', (t) => {
  const book = makeBook(1);
  const [bid, ask] = book.getSpread();
  t.is(bid, 9900);
  t.is(ask, 10000);
});

test('toString()', (t) => {
  const book = makeBook();
  t.is(
    book.toString(),
    `B 0.90: 1000
B 0.91: 4000
B 0.99: 5000
-----
S 1.00: 1500
S 1.05: 2000
`,
  );
});
