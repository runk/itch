import fs from 'fs';
import { MessageType } from '../types';

type OnMessageFn = (type: MessageType, msg: Buffer) => void;

// @ts-ignore
const debug = (msg: string) => {
  // console.log('reader: %s', msg);
};

export default (source: string, onMessage: OnMessageFn) => {
  // const stream = fs.createReadStream(source, { start: 0, end: 10 * 7000000 });
  const stream = fs.createReadStream(source);
  let leftover: Buffer | undefined;
  let seq = 0;
  stream.on('data', (chunk: Buffer) => {
    const buf =
      leftover !== undefined ? Buffer.concat([leftover, chunk]) : chunk;

    // console.log('> chunk', chunk.length)
    // console.log('> leftover', leftover?.length ?? 0)
    leftover = undefined;

    let offset = 0;
    let size = 0;
    do {
      if (offset + 2 > buf.length) {
        leftover = buf.slice(offset);
        break;
      }

      size = buf.readUInt16BE(offset);
      if (offset + 2 + size > buf.length) {
        leftover = buf.slice(offset);
        break;
      }
      seq++;

      // TODO: use int8
      const type = buf.toString('latin1', offset + 2, offset + 3);

      // TODO: do not copy - use pointers
      const message = buf.slice(offset + 2, offset + 3 + size - 1);

      // const msg = parse(type, message)
      onMessage(type as MessageType, message);

      if (seq % 1e6 == 0) debug(`seq: ${seq}`);

      offset = offset + 2 + size;
    } while (offset < buf.length);

    // if (seq > 20 * 1e6) {
    //   console.log("Hard stop")
    //   process.kill(1)
    // }
  });

  stream.on('end', () => {
    debug('stream end');
  });
};
