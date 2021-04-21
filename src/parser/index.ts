import { MessageType } from '../types';
import {
  MessageAddOrder,
  MessageOrderCancel,
  MessageOrderDelete,
  MessageOrderExecuted,
  MessageOrderExecutedWithPrice,
  MessageOrderReplace,
  MessageStockDirectory,
} from './msg';

export default (
  buf: Buffer
):
  | MessageAddOrder
  | MessageOrderCancel
  | MessageOrderDelete
  | MessageOrderExecuted
  | MessageOrderExecutedWithPrice
  | MessageOrderReplace
  | MessageStockDirectory
  | null => {
  const type = buf.toString('latin1', 0, 1);
  switch (type) {
    case MessageType.StockDirectory:
      return new MessageStockDirectory(buf);

    case MessageType.AddOrder:
    case MessageType.AddOrderWithAttribution:
      return new MessageAddOrder(buf);

    case MessageType.OrderDelete:
      return new MessageOrderDelete(buf);

    case MessageType.OrderCancel:
      return new MessageOrderCancel(buf);

    case MessageType.OrderReplace:
      return new MessageOrderReplace(buf);

    case MessageType.OrderExecutedWithPrice:
      return new MessageOrderExecutedWithPrice(buf);

    case MessageType.OrderExecuted:
      return new MessageOrderExecuted(buf);
  }
  return null;
};
