import Pool, { Order } from ".";
import { MessageAddOrder, MessageOrderCancel, MessageOrderDelete, MessageOrderExecuted, MessageOrderExecutedWithPrice, MessageOrderReplace, MessageStockDirectory } from "../parser";
import { MessageType } from "../types";

export default (pool: Pool) => {
  const onMessage = (type: MessageType, buf: Buffer) => {
    let msg, order;
    switch (type) {
      case MessageType.AddOrder:
      case MessageType.AddOrderWithAttribution:
        msg = new MessageAddOrder(buf)
        if (msg.locate != 13) break;
        pool.add(msg.stock, msg.locate, msg.price, msg.shares, msg.reference, msg.side);
        break;

      case MessageType.OrderDelete:
        msg = new MessageOrderDelete(buf);
        if (msg.locate != 13) break;
        pool.delete(msg.reference)
        break;

      case MessageType.OrderCancel:
        msg = new MessageOrderCancel(buf);
        if (msg.locate != 13) break;
        pool.modify(msg.reference, msg.shares)
        break;

      case MessageType.OrderReplace:
        msg = new MessageOrderReplace(buf);
        if (msg.locate != 13) break;
        order = pool.get(msg.reference)
        if (!order) {
          throw new Error('Order not found')
        }

        pool.add(order.stock, msg.locate, msg.price, msg.shares, msg.referenceNew, order.side)
        pool.delete(msg.reference)
        break

      case MessageType.OrderExecutedWithPrice:
        msg = new MessageOrderExecutedWithPrice(buf);
        if (msg.locate != 13) break;
        pool.modify(msg.reference, msg.shares)
        break

      case MessageType.OrderExecuted:
        msg = new MessageOrderExecuted(buf);
        if (msg.locate != 13) break;

        pool.modify(msg.reference, msg.shares)
        break;

      case MessageType.StockDirectory:
        msg = new MessageStockDirectory(buf);
        if (msg.locate != 13) break;

        pool.stockRegister(msg.locate, msg.stock)
        break;
    }
  }

  return onMessage;
}
