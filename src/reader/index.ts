import fs from 'fs';
import parse from '../parser';
import { Message } from '../types';


type OnMessageFn = (msg: Message) => void;

export default (source: string, onMessage: OnMessageFn) => {
  // const stream = fs.createReadStream(source, { start: 0, end: 10 * 7000000 });
  const stream = fs.createReadStream(source);
  let leftover: Buffer | undefined;
  let seq = 0;
  stream.on("data", (chunk: Buffer) => {
    const buf = leftover !== undefined ? Buffer.concat([leftover, chunk]) : chunk;

    // console.log('> chunk', chunk.length)
    // console.log('> leftover', leftover?.length ?? 0)
    leftover = undefined;

    let offset = 0;
    let size = 0;
    do {
      if (offset + 2 > buf.length) {
        leftover = buf.slice(offset)
        break;
      }

      size = buf.readUInt16BE(offset)
      if (offset + 2 + size > buf.length) {
        leftover = buf.slice(offset)
        break;
      }
      seq++;

      // TODO: use int8
      const type = buf.toString('latin1', offset + 2, offset + 3)

      // TODO: do not copy
      const message = buf.slice(offset + 2, offset + 3 + size - 1)

      const msg = parse(type, message)
      if (msg !== null) {
        onMessage(msg);
      }

      if (seq % 1e6 == 0) console.log('> seq', seq)

      offset = offset + 2 + size;
    } while (offset < buf.length);

    if (seq > 20 * 1e6) {
      console.log("Hard stop")
      process.kill(1)
    }
  });

  stream.on("end", () => {
    console.log("> end");
  });
}
