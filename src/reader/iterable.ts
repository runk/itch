import fs from 'fs';

/**
 * @param fd file descriptor
 */
export default (fd: number) => {
  let offset = 0;
  let size = 0;
  let sizeBuf = Buffer.allocUnsafe(2);

  const iterator: IterableIterator<Buffer> = {
    [Symbol.iterator]: function () { return this; },
    next: () => {
      fs.readSync(fd, sizeBuf, 0, 2, offset);
      size = sizeBuf.readUInt16BE();

      const msg = Buffer.allocUnsafe(size);
      fs.readSync(fd, msg, 0, size, offset + 2);

      offset = offset + 2 + size;
      return { value: msg, done: false };
    },
  };

  return iterator;
};
