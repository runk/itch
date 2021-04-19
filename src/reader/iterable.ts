import fs from 'fs';

const PAGE_SIZE = 65536;

/**
 * @param fd file descriptor
 */
export default (fd: number) => {
  let offset = 0;
  let size = 0;
  let chunk: Buffer;
  let chunkOffset: number;

  const stats = fs.fstatSync(fd);
  const totalSize = stats.size;

  const readChunk = () => {
    chunkOffset = 0;
    chunk = Buffer.alloc(PAGE_SIZE);
    fs.readSync(fd, chunk, 0, PAGE_SIZE, offset);
  }

  const iterator: IterableIterator<Buffer> = {
    [Symbol.iterator]: function () { return this; },
    next: () => {
      if (!chunk) readChunk();

      if (chunkOffset + 2 > chunk.length) {
        readChunk();
      }

      size = chunk.readUInt16BE(chunkOffset);
      if (chunkOffset + 2 + size > chunk.length) {
        readChunk()
      }

      // TODO: do not copy
      const value = chunk.slice(chunkOffset + 2, chunkOffset + 2 + size);
      offset = offset + 2 + size;
      chunkOffset = chunkOffset + 2 + size;

      return { value, done: offset === totalSize }
    }
  };

  return iterator;
};
