import fs from 'fs';
import path from 'path';
import createIterator from '../reader/iterable';
import createManager from '../manager';
import Pool from '../pool';
import OrderBook from '.';
import gen, { Level } from './generator';
import parse from '../parser';
import test from 'ava';

let reader: IterableIterator<Buffer>;
let fd: number;

const feed = path.resolve(__dirname, '../../test/locate-13-10k.bin');
test.beforeEach(() => {
  fd = fs.openSync(feed, 'r');
  reader = createIterator(fd);
});
test.afterEach(() => fs.closeSync(fd));

const stringify = (levels: Level[], side: 'S' | 'B'): string => {
  const out = [];
  for (const l of levels) {
    out.push(
      `${side} ${(l.price / 1e4).toFixed(2)}: ${l.shares} (${l.orders})`
    );
  }
  return out.join('\n');
};

const readFeed = (): Pool => {
  const pool = new Pool();
  const book = new OrderBook();
  const manager = createManager(pool, book);
  for (let i = 0; i <= 10000; i++) {
    const item = reader.next();
    const msg = parse(item.value);
    if (msg === null) continue;
    manager(msg);
  }
  return pool;
};

test.serial('makes order book from pool', (t) => {
  const pool = readFeed();
  const { bids, asks } = gen(pool, Infinity);
  t.is(
    stringify(bids, 'B'),
    `B 320.14: 25 (1)
B 320.11: 101 (2)
B 320.00: 417 (10)
B 319.99: 30 (1)
B 319.88: 100 (1)
B 319.75: 25 (1)
B 319.53: 100 (1)
B 319.17: 5 (1)
B 319.10: 110 (2)
B 319.09: 12 (1)
B 319.08: 30 (1)
B 319.00: 1049 (4)
B 318.77: 100 (1)
B 318.72: 25 (1)
B 318.50: 42 (1)
B 318.36: 50 (1)
B 318.31: 70 (1)
B 318.17: 100 (1)
B 318.10: 100 (1)
B 318.00: 319 (7)
B 317.85: 200 (1)
B 317.03: 20 (1)
B 317.00: 478 (7)
B 316.90: 8 (1)
B 316.72: 25 (1)
B 316.43: 100 (1)
B 316.11: 30 (1)
B 316.05: 200 (1)
B 316.00: 247 (4)
B 315.99: 250 (1)
B 315.56: 100 (1)
B 315.46: 30 (1)
B 315.30: 3 (1)
B 315.00: 2144 (8)
B 314.80: 25 (1)
B 314.50: 100 (1)
B 314.00: 68 (1)
B 313.00: 2 (1)
B 312.50: 5 (1)
B 312.00: 70 (3)
B 311.16: 50 (1)
B 310.00: 46 (4)
B 309.00: 1 (1)
B 308.50: 400 (1)
B 308.17: 100 (1)
B 308.00: 12 (2)
B 307.70: 7 (1)
B 307.50: 600 (1)
B 306.86: 10 (1)
B 306.60: 60 (1)
B 306.00: 2 (1)
B 305.00: 53 (2)
B 303.20: 10 (1)
B 303.08: 30 (1)
B 303.00: 200 (1)
B 301.01: 3 (1)
B 300.33: 700 (1)
B 300.05: 10 (1)
B 300.00: 12 (2)
B 295.01: 20 (1)
B 290.00: 5 (1)
B 285.00: 6 (2)
B 284.94: 23 (1)
B 282.01: 50 (1)
B 280.00: 107 (3)
B 278.00: 1 (1)
B 277.99: 80 (1)
B 270.00: 100 (1)
B 260.00: 100 (1)
B 256.00: 200 (1)
B 250.00: 4 (1)
B 243.00: 15 (1)
B 220.00: 4 (1)
B 211.00: 5 (1)
B 210.00: 1 (1)
B 205.22: 50 (1)
B 200.99: 10 (1)
B 150.00: 1 (1)
B 0.01: 100 (1)`
  );

  t.is(
    stringify(asks, 'S'),
    `S 320.30: 100 (1)
S 320.40: 100 (1)
S 320.50: 100 (1)
S 320.75: 100 (1)
S 320.90: 59 (1)
S 321.00: 151 (4)
S 321.01: 187 (1)
S 321.10: 200 (1)
S 321.18: 10 (1)
S 321.49: 200 (1)
S 321.50: 235 (4)
S 321.51: 11 (1)
S 321.80: 300 (1)
S 321.90: 200 (1)
S 321.91: 11 (1)
S 321.94: 28 (1)
S 322.00: 522 (2)
S 322.85: 100 (1)
S 322.94: 12 (1)
S 323.00: 29 (2)
S 323.64: 15 (1)
S 324.00: 675 (5)
S 324.15: 3 (1)
S 324.24: 10 (1)
S 324.27: 5 (1)
S 324.34: 126 (3)
S 324.38: 17 (1)
S 324.65: 13 (1)
S 324.80: 775 (1)
S 324.85: 50 (1)
S 325.00: 5 (1)
S 325.21: 9 (1)
S 325.40: 300 (1)
S 326.00: 500 (1)
S 326.45: 93 (1)
S 326.85: 3 (1)
S 327.00: 92 (2)
S 327.07: 16 (1)
S 327.50: 10 (1)
S 327.80: 170 (1)
S 327.85: 10 (1)
S 328.00: 823 (6)
S 329.00: 10 (1)
S 329.57: 4 (1)
S 329.99: 180 (1)
S 330.00: 1109 (6)
S 330.21: 200 (1)
S 332.97: 3 (1)
S 333.00: 5 (1)
S 334.00: 3 (1)
S 335.00: 5 (1)
S 337.92: 30 (1)
S 341.57: 1 (1)
S 342.00: 6 (1)
S 344.00: 45 (1)
S 349.80: 15 (1)
S 350.00: 20 (1)
S 360.00: 76 (2)
S 363.88: 5 (1)
S 394.56: 3 (1)
S 450.00: 1 (1)
S 628.50: 15 (1)
S 199999.99: 100 (1)`
  );
  t.is(pool.store.size, 215);
});

test.serial('makes order book from pool with depth = 5', (t) => {
  const pool = readFeed();
  const { bids, asks } = gen(pool, 5);
  t.is(
    stringify(bids, 'B'),
    `B 320.14: 25 (1)
B 320.11: 101 (2)
B 320.00: 417 (10)
B 319.99: 30 (1)
B 319.88: 100 (1)`
  );
  t.is(
    stringify(asks, 'S'),
    `S 320.30: 100 (1)
S 320.40: 100 (1)
S 320.50: 100 (1)
S 320.75: 100 (1)
S 320.90: 59 (1)`
  );
});
