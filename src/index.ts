// const path = require('path');
import fs from 'fs';
import * as decoders from './decoders'
import { Message, MessageType } from './types';

// https://www.nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/NQTVITCHSpecification.pdf
const source = "/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50";


const parse = (type: string, buf: Buffer): Message | null => {
	if (type == MessageType.AddOrder || type == MessageType.AddOrderWithAttribution) {
		return {
			header: decoders.header(type, buf),
			body: {
				ref: buf.toString('hex', 11, 19),
				side: buf.toString('latin1', 19, 20),
				shares: buf.readUInt32BE(20),
				stock: buf.toString('latin1', 24, 32),
				price: buf.readUInt32BE(32),
			}
		}
	}

	if (type === MessageType.System) {
		return {
			header: decoders.header(type, buf),
			body: {
				eventCode: buf.toString('latin1', 11, 12)
			}
		};
	}

	if (type === MessageType.StockDirectory) {
		return {
			header: decoders.header(type, buf),
			body: {
				stock: buf.toString('latin1', 11, 19),
			}
		}
	}

	if (type === MessageType.OrderExecuted) {
		return {
			header: decoders.header(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
				shares: buf.readUInt32BE(19),
				match: buf.toString('hex', 23, 31),
			}
		}
	}

	if (type === MessageType.OrderExecutedWithPrice) {
		return {
			header: decoders.header(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
				shares: buf.readUInt32BE(19),
				match: buf.toString('hex', 23, 31),
				printable: buf[31],
				price: buf.readUInt32BE(32),
			}
		}
	}

	if (type === MessageType.OrderCancel) {
		return {
			header: decoders.header(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
				shares: buf.readUInt32BE(19)
			}
		}
	}

	if (type === MessageType.OrderDelete) {
		return {
			header: decoders.header(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
			}
		}
	}

	if (type === MessageType.OrderReplace) {
		return {
			header: decoders.header(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
				referenceNew: buf.toString('hex', 19, 27),
				shares: buf.readUInt32BE(27),
				price: buf.readUInt32BE(31),
			}
		}
	}

	return null;
};

// const b = Buffer.from('0a4142494f20202020534e000000644e435a20504e4e324e000000004e002752001e0000', 'hex')
// console.log(b)

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

		const type = buf.toString('latin1', offset + 2, offset + 3)
		const message = buf.slice(offset + 2, offset + 3 + size - 1)

		if (type === 'A') {
			const msg = parse(type, message)
			// console.log(msg)
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
