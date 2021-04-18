import fs from 'fs';
import createIterator from './iterable';

let reader: IterableIterator<Buffer>;
let fd: number;

beforeEach(() => {
  fd = fs.openSync('/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50', 'r');
  reader = createIterator(fd);
})
afterEach((done) => fs.close(fd, done));

test('supports `for .. of` syntax', () => {
  let i = 0;
  for (let msg of reader) {
    const type = String.fromCharCode(msg[0]);
    // system & stock directory messages
    expect(['S', 'R']).toContain(type)
    expect(msg.length).toBeGreaterThan(10)

    if (i++ >= 50) {
      break;
    }
  }
})

test('supports `next()` iteration style', () => {
  for (let i = 0; i < 50; i++) {
    const msg = reader.next();
    const type = String.fromCharCode(msg.value[0]);
    // system & stock directory messages
    expect(['S', 'R']).toContain(type);
    expect(msg.done).toBe(false);
    expect(msg.value.length).toBeGreaterThan(10)
  }
})
