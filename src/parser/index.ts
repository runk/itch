import { Message, MessageHeader, MessageType } from "../types";
import { timestampToTime } from "../utils";

export const getLocate = (buf: Buffer) => buf.readUInt16BE(1);

const parseHeader = (type: MessageType, buf: Buffer): MessageHeader => ({
	type,
	locate: buf.readUInt16BE(1),
	tracking: buf.readUInt16BE(3),
	timestamp: parseInt(buf.toString('hex', 5, 11), 16),
})

class Base {
	readonly locate: number;
	readonly tracking: number;
	readonly timestamp: number;

	constructor(buf: Buffer) {
		this.locate = buf.readUInt16BE(1)
		this.tracking = buf.readUInt16BE(3);
		this.timestamp = parseInt(buf.toString('hex', 5, 11), 16)
	}

	toString() {
		return `${timestampToTime(this.timestamp)}  ${this.constructor.name} ${this.locate}`
	}
}

export class MessageAddOrder extends Base {
	readonly reference: string;
	readonly side: string;
	readonly shares: number;
	readonly stock: string;
	readonly price: number;

	constructor(buf: Buffer) {
		super(buf);
		this.reference = buf.toString('hex', 11, 19)
		this.side = buf.toString('latin1', 19, 20)
		this.shares = buf.readUInt32BE(20)
		this.stock = buf.toString('latin1', 24, 32)
		this.price = buf.readUInt32BE(32)
	}
}

export class MessageSystem extends Base {
	readonly eventCode: string;
	constructor(buf: Buffer) {
		super(buf);
		this.eventCode = buf.toString('latin1', 11, 12)
	}
}

export class MessageStockDirectory extends Base {
	readonly stock: string
	constructor(buf: Buffer) {
		super(buf);
		this.stock = buf.toString('latin1', 11, 19)
	}
}

export class MessageOrderExecuted extends Base {
	readonly reference: string
	readonly shares: number;
	readonly match: string;

	constructor(buf: Buffer) {
		super(buf);
		this.reference = buf.toString('hex', 11, 19)
		this.shares = buf.readUInt32BE(19)
		this.match = buf.toString('hex', 23, 31)
	}

	toString() {
		return `${super.toString()} ${this.shares}`
	}
}

export class MessageOrderExecutedWithPrice extends Base {
	readonly reference: string
	readonly shares: number;
	readonly match: string;
	readonly printable: number;
	readonly price: number;

	constructor(buf: Buffer) {
		super(buf);
		this.reference = buf.toString('hex', 11, 19)
		this.shares = buf.readUInt32BE(19)
		this.match = buf.toString('hex', 23, 31)
		this.printable = buf[31]
		this.price = buf.readUInt32BE(32)
	}

	toString() {
		return `${super.toString()} ${this.shares} ${this.price}`
	}
}

export class MessageOrderCancel extends Base {
	readonly reference: string
	readonly shares: number;

	constructor(buf: Buffer) {
		super(buf);
		this.reference = buf.toString('hex', 11, 19)
		this.shares = buf.readUInt32BE(19)
	}
}

export class MessageOrderDelete extends Base {
	readonly reference: string

	constructor(buf: Buffer) {
		super(buf);
		this.reference = buf.toString('hex', 11, 19)
	}
}

export class MessageOrderReplace extends Base {
	readonly reference: string
	readonly referenceNew: string
	readonly shares: number;
	readonly price: number;

	constructor(buf: Buffer) {
		super(buf);
		this.reference = buf.toString('hex', 11, 19)
		this.referenceNew = buf.toString('hex', 19, 27),
			this.shares = buf.readUInt32BE(27)
		this.price = buf.readUInt32BE(31)
	}
}


// export default (type: string, buf: Buffer): Message | null => {
	// if (type == MessageType.AddOrder || type == MessageType.AddOrderWithAttribution) {
	// 	return {
	// 		header: parseHeader(type, buf),
	// 		body: {
	// 			reference: buf.toString('hex', 11, 19),
	// 			side: buf.toString('latin1', 19, 20),
	// 			shares: buf.readUInt32BE(20),
	// 			stock: buf.toString('latin1', 24, 32),
	// 			price: buf.readUInt32BE(32),
	// 		}
	// 	}
	// }

	// if (type === MessageType.System) {
	// 	return {
	// 		header: parseHeader(type, buf),
	// 		body: {
	// 			eventCode: buf.toString('latin1', 11, 12)
	// 		}
	// 	};
	// }

	// if (type === MessageType.StockDirectory) {
	// 	return {
	// 		header: parseHeader(type, buf),
	// 		body: {
	// 			stock: buf.toString('latin1', 11, 19),
	// 		}
	// 	}
	// }

	// if (type === MessageType.OrderExecuted) {
	// 	return {
	// 		header: parseHeader(type, buf),
	// 		body: {
	// 			reference: buf.toString('hex', 11, 19),
	// 			shares: buf.readUInt32BE(19),
	// 			match: buf.toString('hex', 23, 31),
	// 		}
	// 	}
	// }

	// if (type === MessageType.OrderExecutedWithPrice) {
	// 	return {
	// 		header: parseHeader(type, buf),
	// 		body: {
	// 			reference: buf.toString('hex', 11, 19),
	// 			shares: buf.readUInt32BE(19),
	// 			match: buf.toString('hex', 23, 31),
	// 			printable: buf[31],
	// 			price: buf.readUInt32BE(32),
	// 		}
	// 	}
	// }

	// if (type === MessageType.OrderCancel) {
	// 	return {
	// 		header: parseHeader(type, buf),
	// 		body: {
	// 			reference: buf.toString('hex', 11, 19),
	// 			shares: buf.readUInt32BE(19)
	// 		}
	// 	}
	// }

	// if (type === MessageType.OrderDelete) {
	// 	return {
	// 		header: parseHeader(type, buf),
	// 		body: {
	// 			reference: buf.toString('hex', 11, 19),
	// 		}
	// 	}
	// }

	// if (type === MessageType.OrderReplace) {
	// 	return {
	// 		header: parseHeader(type, buf),
	// 		body: {
	// 			reference: buf.toString('hex', 11, 19),
	// 			referenceNew: buf.toString('hex', 19, 27),
	// 			shares: buf.readUInt32BE(27),
	// 			price: buf.readUInt32BE(31),
	// 		}
	// 	}
	// }


// 	return null;
// };
