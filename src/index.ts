import Pool from './pool';
import fs from 'fs';
import newManager from './manager';
import createIterator from './reader/iterable';
import { MessageType } from './types';
import { OrderBook } from './order-book';

const source = '/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50';

const pool = new Pool();
const book = new OrderBook();
const manager = newManager(pool, book);

const fd = fs.openSync(source, 'r');
const read = createIterator(fd);

// let seq = 0;
for (const buf of read) {
  manager(buf.toString('latin1', 0, 1) as MessageType, buf);
  // if (seq++ % 1e6 == 0) console.log('> seq', seq)
}
