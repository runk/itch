import { Side } from '../order';
import { MessageType } from '../types';
import { timestampToTime } from '../utils';

export const getLocate = (buf: Buffer) => buf.readUInt16BE(1);
export const getTimestamp = (buf: Buffer) =>
  parseInt(buf.toString('hex', 5, 11), 16);
export const getTimestampHuman = (buf: Buffer) =>
  timestampToTime(parseInt(buf.toString('hex', 5, 11), 16));

export class Message {
  readonly type: MessageType = MessageType.System;
  readonly locate: number;
  readonly tracking: number;
  readonly timestamp: number;

  constructor(buf: Buffer) {
    this.locate = buf.readUInt16BE(1);
    this.tracking = buf.readUInt16BE(3);
    this.timestamp = parseInt(buf.toString('hex', 5, 11), 16);
  }

  toString() {
    return `${timestampToTime(this.timestamp)}  ${this.constructor.name} ${
      this.locate
    }`;
  }
}

export class MessageAddOrder extends Message {
  readonly type: MessageType = MessageType.AddOrder;
  readonly reference: string;
  readonly side: Side;
  readonly shares: number;
  readonly stock: string;
  readonly price: number;

  constructor(buf: Buffer) {
    super(buf);
    this.reference = buf.toString('hex', 11, 19);
    this.side = buf.toString('latin1', 19, 20) as Side;
    this.shares = buf.readUInt32BE(20);
    this.stock = buf.toString('latin1', 24, 32);
    this.price = buf.readUInt32BE(32);
  }
}

export class MessageAddOrderWithAttribution extends MessageAddOrder {
  readonly type: MessageType = MessageType.AddOrderWithAttribution;
}

export class MessageSystem extends Message {
  readonly type: MessageType = MessageType.System;
  readonly eventCode: string;
  constructor(buf: Buffer) {
    super(buf);
    this.eventCode = buf.toString('latin1', 11, 12);
  }
}

export class MessageStockDirectory extends Message {
  readonly type: MessageType = MessageType.StockDirectory;
  readonly stock: string;
  constructor(buf: Buffer) {
    super(buf);
    this.stock = buf.toString('latin1', 11, 19);
  }
}

export class MessageOrderExecuted extends Message {
  readonly type = MessageType.OrderExecuted;
  readonly reference: string;
  readonly shares: number;
  readonly match: string;

  constructor(buf: Buffer) {
    super(buf);
    this.reference = buf.toString('hex', 11, 19);
    this.shares = buf.readUInt32BE(19);
    this.match = buf.toString('hex', 23, 31);
  }

  toString() {
    return `${super.toString()} ${this.shares}`;
  }
}

export class MessageOrderExecutedWithPrice extends Message {
  readonly type = MessageType.OrderExecutedWithPrice;
  readonly reference: string;
  readonly shares: number;
  readonly match: string;
  readonly printable: number;
  readonly price: number;

  constructor(buf: Buffer) {
    super(buf);
    this.reference = buf.toString('hex', 11, 19);
    this.shares = buf.readUInt32BE(19);
    this.match = buf.toString('hex', 23, 31);
    this.printable = buf[31];
    this.price = buf.readUInt32BE(32);
  }

  toString() {
    return `${super.toString()} ${this.shares} ${this.price}`;
  }
}

export class MessageOrderCancel extends Message {
  readonly type = MessageType.OrderCancel;
  readonly reference: string;
  readonly shares: number;

  constructor(buf: Buffer) {
    super(buf);
    this.reference = buf.toString('hex', 11, 19);
    this.shares = buf.readUInt32BE(19);
  }
}

export class MessageOrderDelete extends Message {
  readonly type = MessageType.OrderDelete;
  readonly reference: string;

  constructor(buf: Buffer) {
    super(buf);
    this.reference = buf.toString('hex', 11, 19);
  }
}

export class MessageOrderReplace extends Message {
  readonly type = MessageType.OrderReplace;
  readonly reference: string;
  readonly referenceNew: string;
  readonly shares: number;
  readonly price: number;

  constructor(buf: Buffer) {
    super(buf);
    this.reference = buf.toString('hex', 11, 19);
    this.referenceNew = buf.toString('hex', 19, 27);
    this.shares = buf.readUInt32BE(27);
    this.price = buf.readUInt32BE(31);
  }
}
