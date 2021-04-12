// const path = require('path');
const fs = require("fs");

// https://www.nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/NQTVITCHSpecification.pdf
const source = "/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50";

// const readInt = (offset: number, length: number, buf: Buffer) => {
// 	let val = BigInt(0);
// 	const eight = BigInt(8);
// 	for (let i = 0; i < length; i++) {
// 		val = (val << eight) + BigInt(buf[offset + i]);
// 	}
// 	return val
// }

// Order book: (type A, P, D, R, E, C)
const parse = (type: string, buf: Buffer) => {
	if (type == 'A') {
		return {
			type,
			locate: buf.readUInt16BE(1),
			tracking: buf.readUInt16BE(3),
			timestamp: parseInt(buf.toString('hex', 5, 11), 16),
			ref: buf.toString('hex', 11, 19),
			side: buf.toString('latin1', 19, 20),
			shares: buf.readUInt32BE(20),
			stock: buf.toString('latin1', 24, 32),
			price: buf.readUInt32BE(32),
		}
	}

	if (type === 'P') {
		return {
			type,
			locate: buf.readUInt16BE(1),
			tracking: buf.readUInt16BE(3),
			timestamp: parseInt(buf.toString('hex', 5, 11), 16),
			ref: buf.toString('hex', 11, 19),
			side: 'B',
			shares: buf.readUInt32BE(20),
			stock: buf.toString('latin1', 24, 32),
			price: buf.readUInt32BE(32),
		}
	}

	if (type === "S") {
		return {
			type,
			locate: buf.readUInt16BE(1),
			tracking: buf.readUInt16BE(3),
			timestamp: parseInt(buf.toString('hex', 5, 11), 16),
			eventCode: buf.toString('latin1', 11, 12)
		};
	}

	if (type === "R") {
		return {
			type,
			locate: buf.readUInt16BE(1),
			tracking: buf.readUInt16BE(3),
			timestamp: parseInt(buf.toString('hex', 5, 11), 16),
			stock: buf.toString('latin1', 11, 19),
		}
	}

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
