import fs from 'fs';
import path from 'path';
import createIterator from './reader/iterable';
import createManager, { OrderManager } from './manager';
import Pool from './pool';
import OrderBook from './order-book';
import parse from './parser';

let reader: IterableIterator<Buffer>;
let fd: number;

const feed = path.resolve(__dirname, '../test/locate-13-10k.bin');
beforeEach(() => {
  fd = fs.openSync(feed, 'r');
  reader = createIterator(fd);
});
afterEach((done) => fs.close(fd, done));

test('builds pool and book', () => {
  const pool = new Pool();
  const book = new OrderBook();
  const manager = createManager(pool, book);
  for (let i = 0; i <= 1000; i++) {
    const item = reader.next();
    const msg = parse(item.value);
    if (msg === null) continue;
    manager(msg);
  }

  expect(book.toString()).toMatchInlineSnapshot(`
    "B 216.00: 5
    B 260.00: 100
    B 270.00: 100
    B 278.00: 1
    B 280.00: 107
    B 285.00: 6
    B 290.00: 5
    B 295.01: 20
    B 301.01: 3
    B 303.00: 200
    B 305.00: 3
    B 308.00: 5
    B 310.00: 10
    B 311.00: 5
    B 311.16: 50
    B 313.00: 2
    B 314.00: 68
    B 315.00: 2104
    B 316.00: 245
    B 317.00: 163
    B 318.00: 38
    B 318.10: 100
    B 319.00: 30
    B 319.08: 30
    B 319.30: 100
    B 319.75: 25
    B 320.00: 25
    B 320.05: 200
    B 320.07: 100
    B 320.90: 201
    B 321.00: 10
    B 321.17: 30
    B 321.20: 1000
    B 321.40: 23
    B 321.50: 60
    -----
    S 321.67: 4
    S 321.70: 100
    S 321.90: 100
    S 322.00: 120
    S 322.40: 300
    S 322.50: 100
    S 322.87: 100
    S 323.00: 20
    S 324.00: 120
    S 324.15: 3
    S 324.24: 10
    S 324.27: 32
    S 324.34: 63
    S 327.80: 170
    S 328.10: 11
    S 328.34: 10
    S 328.50: 10
    S 329.99: 180
    S 330.00: 2
    S 332.97: 3
    S 333.00: 5
    S 342.00: 6
    S 344.00: 45
    S 349.80: 15
    S 350.00: 5
    S 360.00: 76
    S 363.88: 5
    S 394.56: 3
    S 400.00: 80
    "
  `);

  expect(pool.store.size).toBe(80);
});
