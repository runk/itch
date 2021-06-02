import { Side } from '../order';
import {
  Message,
  MessageAddOrder,
  MessageAddOrderWithAttribution,
  MessageOrderCancel,
  MessageOrderExecuted,
  MessageOrderExecutedWithPrice,
  MessageOrderReplace,
  MessageStockDirectory,
  MessageSystem,
  MessageType,
} from './types';
import { timestampToTime } from '../utils';

export const getType = (buf: Buffer) => buf.toString('latin1', 0, 1);
export const getLocate = (buf: Buffer) => buf.readUInt16BE(1);
export const getTimestamp = (buf: Buffer) =>
  parseInt(buf.toString('hex', 5, 11), 16);
export const getTimestampHuman = (buf: Buffer) =>
  timestampToTime(parseInt(buf.toString('hex', 5, 11), 16));

type Parser<T> = (buf: Buffer) => T;

export const parseBaseMessage: Parser<Message> = (buf: Buffer) => {
  return {
    type: MessageType.System,
    locate: buf.readUInt16BE(1),
    tracking: buf.readUInt16BE(3),
    timestamp: parseInt(buf.toString('hex', 5, 11), 16),
  };
};

export const parseAddOrderMessage: Parser<MessageAddOrder> = (buf: Buffer) => {
  return {
    ...parseBaseMessage(buf),
    type: MessageType.AddOrder,
    reference: buf.toString('hex', 11, 19),
    side: buf.toString('latin1', 19, 20) as Side,
    shares: buf.readUInt32BE(20),
    stock: buf.toString('latin1', 24, 32),
    price: buf.readUInt32BE(32),
  };
};

export const parseAddOrderWithAttributionMessage: Parser<MessageAddOrderWithAttribution> =
  (buf: Buffer) => {
    return {
      ...parseAddOrderMessage(buf),
      type: MessageType.AddOrderWithAttribution,
    };
  };

export const parseMessageSystem: Parser<MessageSystem> = (buf: Buffer) => {
  return {
    ...parseBaseMessage(buf),
    type: MessageType.System,
    eventCode: buf.toString('latin1', 11, 12),
  };
};

export const parseMessageStockDirectory: Parser<MessageStockDirectory> = (
  buf: Buffer
) => {
  return {
    ...parseBaseMessage(buf),
    type: MessageType.StockDirectory,
    stock: buf.toString('latin1', 11, 19),
  };
};

export const parseMessageOrderExecuted: Parser<MessageOrderExecuted> = (
  buf: Buffer
) => {
  return {
    ...parseBaseMessage(buf),
    type: MessageType.OrderExecuted,
    reference: buf.toString('hex', 11, 19),
    shares: buf.readUInt32BE(19),
    match: buf.toString('hex', 23, 31),
  };
};

export const parseMessageOrderExecutedWithPrice: Parser<MessageOrderExecutedWithPrice> =
  (buf: Buffer) => {
    return {
      ...parseBaseMessage(buf),
      type: MessageType.OrderExecutedWithPrice,
      reference: buf.toString('hex', 11, 19),
      shares: buf.readUInt32BE(19),
      match: buf.toString('hex', 23, 31),
      printable: buf[31],
      price: buf.readUInt32BE(32),
    };
  };

export const parseMessageOrderCancel: Parser<MessageOrderCancel> = (
  buf: Buffer
) => {
  return {
    ...parseBaseMessage(buf),
    type: MessageType.OrderCancel,
    reference: buf.toString('hex', 11, 19),
    shares: buf.readUInt32BE(19),
  };
};

export interface MessageOrderDelete extends Message {
  type: MessageType.OrderDelete;
  reference: string;
}

export const parseMessageOrderDelete: Parser<MessageOrderDelete> = (
  buf: Buffer
) => {
  return {
    ...parseBaseMessage(buf),
    type: MessageType.OrderDelete,
    reference: buf.toString('hex', 11, 19),
  };
};

export const parseMessageOrderReplace: Parser<MessageOrderReplace> = (
  buf: Buffer
) => {
  return {
    ...parseBaseMessage(buf),
    type: MessageType.OrderReplace,
    reference: buf.toString('hex', 11, 19),
    referenceNew: buf.toString('hex', 19, 27),
    shares: buf.readUInt32BE(27),
    price: buf.readUInt32BE(31),
  };
};
