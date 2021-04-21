import Pool from './pool';
import fs from 'fs';
import newManager from './manager';
import createIterator from './reader/iterable';
import { OrderBook } from './order-book';
import parse from './parser';
import { getLocate, getTimestampHuman } from './parser/msg';

const source = '/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50';

const pool = new Pool();
const book = new OrderBook();
const manager = newManager(pool, book);

const fd = fs.openSync(source, 'r');
const read = createIterator(fd);

// let seq = 0;
let msg;
for (const buf of read) {
  // Listen for AAPL only
  if (getLocate(buf) != 13) continue;
  // if (getTimestampHuman(buf) < '09:40') return;
  if (getTimestampHuman(buf) > '09:35') {
    console.log('hard stop');
    process.exit(1);
  }

  msg = parse(buf);
  if (msg === null) continue;
  manager(msg);
  // if (seq++ % 1e6 == 0) console.log('> seq', seq)
}
