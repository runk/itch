import fs from 'fs';

const PAGE_SIZE = 65536;

/**
 * @param fd file descriptor
 */
export default (fd: number) => {
  let offset = 0;
  let size = 0;
  let page: Buffer;
  let pageOffset: number;

  const stats = fs.fstatSync(fd);
  const totalSize = stats.size;

  const readPage = () => {
    pageOffset = 0;
    page = Buffer.alloc(PAGE_SIZE);
    fs.readSync(fd, page, 0, PAGE_SIZE, offset);
  };

  const iterator: IterableIterator<Buffer> = {
    [Symbol.iterator]: function () {
      return this;
    },
    next: () => {
      if (!page) readPage();

      if (pageOffset + 2 > page.length) {
        readPage();
      }

      size = page.readUInt16BE(pageOffset);
      if (pageOffset + 2 + size > page.length) {
        readPage();
      }

      // TODO: do not copy?
      const value = page.slice(pageOffset + 2, pageOffset + 2 + size);
      offset = offset + 2 + size;
      pageOffset = pageOffset + 2 + size;

      return { value, done: offset === totalSize };
    },
  };

  return iterator;
};
