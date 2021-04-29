import fs from 'fs';
import { MessageType } from '../parser/types';

type OnMessageFn = (type: MessageType, msg: Buffer) => void;

export default (source: string, onMessage: OnMessageFn) => {
  const stream = fs.createReadStream(source);
  let leftover: Buffer | undefined;
  let seq = 0;
  stream.on('data', (chunk: Buffer) => {
    const buf =
      leftover !== undefined ? Buffer.concat([leftover, chunk]) : chunk;

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

      onMessage(type as MessageType, message);

      offset = offset + 2 + size;
    } while (offset < buf.length);
  });
};
