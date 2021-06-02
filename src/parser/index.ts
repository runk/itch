import { MessageType } from './types';
import {
  parseAddOrderMessage,
  parseAddOrderWithAttribution,
  parseOrderDelete,
  parseOrderCancel,
  parseStockDirectory,
  parseOrderReplace,
  parseOrderExecutedWithPrice,
  parseOrderExecuted,
} from './msg';

export default (buf: Buffer) => {
  const type = buf.toString('latin1', 0, 1);
  switch (type) {
    case MessageType.StockDirectory:
      return parseStockDirectory(buf);

    case MessageType.AddOrder:
      return parseAddOrderMessage(buf);

    case MessageType.AddOrderWithAttribution:
      return parseAddOrderWithAttribution(buf);

    case MessageType.OrderDelete:
      return parseOrderDelete(buf);

    case MessageType.OrderCancel:
      return parseOrderCancel(buf);

    case MessageType.OrderReplace:
      return parseOrderReplace(buf);

    case MessageType.OrderExecutedWithPrice:
      return parseOrderExecutedWithPrice(buf);

    case MessageType.OrderExecuted:
      return parseOrderExecuted(buf);
  }

  // console.log('unhandled type', type)
  return null;
};
