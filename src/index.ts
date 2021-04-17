import Pool from './pool';
import newManager from './manager';
import reader from './reader';
import { MessageType } from './types';
import { OrderBook } from './order-book';

const source = '/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50';

const pool = new Pool();
const book = new OrderBook();
const manager = newManager(pool, book);

// let seq = 0;
reader(source, (type: MessageType, buf: Buffer) => {
  manager(type, buf);
  // console.log(buf);
  // if (seq % 1e6 == 0) console.log('> seq', seq)
  // seq++;
});
