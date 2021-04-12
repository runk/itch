import { MessageHeader, MessageType } from "./types"


// const readInt = (offset: number, length: number, buf: Buffer) => {
// 	let val = BigInt(0);
// 	const eight = BigInt(8);
// 	for (let i = 0; i < length; i++) {
// 		val = (val << eight) + BigInt(buf[offset + i]);
// 	}
// 	return val
// }


export const timestamp = (buf: Buffer, pos: number): number => {
  return parseInt(buf.toString('hex', pos, pos + 6), 16)
}

export const header = (type: MessageType, buf: Buffer): MessageHeader => ({
  type,
  locate: buf.readUInt16BE(1),
  tracking: buf.readUInt16BE(3),
  timestamp: timestamp(buf, 5),
})
