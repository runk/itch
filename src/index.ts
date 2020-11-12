// const path = require('path');
const fs = require("fs");

const source = "/Users/dshirokov/Downloads/01302020.NASDAQ_ITCH50";

const readInt = (offset: number, length: number, buf: Buffer) => {
	var value = 0;
	for (var i = length - 1; i >= 0; i--) {
		value = (value * 256) + buf[offset + i];
	}

	return value;

	// let val = 0;
	// for (let i = 0; i < length; i++) {
	// 	val = (val << 8) + buf[offset + i];
	// }
	// return val
}


// Order book: (type A,P,D,R,E,C)
const parse = (type: string, buf: Buffer) => {
	if (type == 'A') {
		/*

Order Reference Number
11 8 Integer The unique reference number assigned to the neworder at
the time of receipt.
Buy/Sell Indicator 19 1 Alpha The type of order being added.
“B” =Buy Order. “S” = SellOrder.
Shares 20 4 Integer The total number of shares associated with the order being
added to the book.
Stock 24 8 Alpha Stock symbol, right padded with spaces
Price 32 4 Price (4) */
		return {
			type,
			locate: buf.readUInt16BE(1),
			tracking: buf.readUInt16BE(3),
			timestamp: readInt(5, 6, buf),
			ref: buf.toString('hex', 11, 19),
			side: buf.toString('hex', 19, 20),
			shares: buf.toString('hex', 20, 24),
			stock: buf.toString('latin1', 24, 32),
			price: buf.readUInt32BE(32),
		}
	}
	// if (type === "S") {
	// 	return {
	// 		type,
	// 		locate: buf.readUInt16BE(1),
	// 		tracking: buf.readUInt16BE(3),
	// 		timestamp: readInt(5, 6, buf),
	// 		eventCode: buf.toString('latin1', 11, 12)
	// 	};
	// }
	if (type === "R") {
		return {
			type,
			locate: buf.readUInt16BE(1),
			tracking: buf.readUInt16BE(3),
			timestamp: readInt(5, 6, buf),
			stock: buf.toString('latin1', 11, 19),
			// Note: there's more fields
		}
	}

};

// const b = Buffer.from('0a4142494f20202020534e000000644e435a20504e4e324e000000004e002752001e0000', 'hex')
// console.log(b)

const stream = fs.createReadStream(source, { start: 0, end: 2 * 100000 });
let leftover: Buffer;
let seq = 0;
stream.on("data", (chunk: Buffer) => {
	const buf = leftover !== undefined ? Buffer.concat([leftover, chunk]) : chunk;

	console.log('> chunk', chunk.length)
	console.log('> leftover', leftover?.length ?? 0)
	leftover = undefined;

	let offset = 0;
	let size = 0;
	do {
		size = buf.readUInt16BE(offset)
		if (offset + 2 + size > buf.length) {
			leftover = buf.slice(offset)
			break;
		}

		const type = buf.toString('latin1', offset + 2, offset + 3)
		const message = buf.slice(offset + 2, offset + 3 + size - 1)
		// if (type === 'R') {
		console.log(seq++, type, message)
		// 	console.log(parse(type, message))
		// }

		offset = offset + 2 + size;
	} while (offset < buf.length);
});

// stream.on("end", (chunk) => {
// 	console.log("> end", chunk);
// });
