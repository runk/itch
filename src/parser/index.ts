import { Message, MessageHeader, MessageType } from "../types";

const parseHeader = (type: MessageType, buf: Buffer): MessageHeader => ({
  type,
  locate: buf.readUInt16BE(1),
  tracking: buf.readUInt16BE(3),
  timestamp: parseInt(buf.toString('hex', 5, 11), 16),
})


export default (type: string, buf: Buffer): Message | null => {
	if (type == MessageType.AddOrder || type == MessageType.AddOrderWithAttribution) {
		return {
			header: parseHeader(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
				side: buf.toString('latin1', 19, 20),
				shares: buf.readUInt32BE(20),
				stock: buf.toString('latin1', 24, 32),
				price: buf.readUInt32BE(32),
			}
		}
	}

	if (type === MessageType.System) {
		return {
			header: parseHeader(type, buf),
			body: {
				eventCode: buf.toString('latin1', 11, 12)
			}
		};
	}

	if (type === MessageType.StockDirectory) {
		return {
			header: parseHeader(type, buf),
			body: {
				stock: buf.toString('latin1', 11, 19),
			}
		}
	}

	if (type === MessageType.OrderExecuted) {
		return {
			header: parseHeader(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
				shares: buf.readUInt32BE(19),
				match: buf.toString('hex', 23, 31),
			}
		}
	}

	if (type === MessageType.OrderExecutedWithPrice) {
		return {
			header: parseHeader(type, buf),
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
			header: parseHeader(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
				shares: buf.readUInt32BE(19)
			}
		}
	}

	if (type === MessageType.OrderDelete) {
		return {
			header: parseHeader(type, buf),
			body: {
				reference: buf.toString('hex', 11, 19),
			}
		}
	}

	if (type === MessageType.OrderReplace) {
		return {
			header: parseHeader(type, buf),
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
