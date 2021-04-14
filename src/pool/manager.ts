import Pool, { Order } from ".";
import { getLocate, MessageAddOrder, MessageOrderCancel, MessageOrderDelete, MessageOrderExecuted, MessageOrderExecutedWithPrice, MessageOrderReplace, MessageStockDirectory } from "../parser";
import { MessageType } from "../types";

export default (pool: Pool) => {
  const onMessage = (type: MessageType, buf: Buffer) => {
    let msg, order;
    switch (type) {
      case MessageType.AddOrder:
      case MessageType.AddOrderWithAttribution:
        if (getLocate(buf) != 13) break;
        msg = new MessageAddOrder(buf)
        pool.add(msg.stock, msg.locate, msg.price, msg.shares, msg.reference, msg.side);
        break;

      case MessageType.OrderDelete:
        if (getLocate(buf) != 13) break;
        msg = new MessageOrderDelete(buf);
        pool.delete(msg.reference)
        break;

      case MessageType.OrderCancel:
        if (getLocate(buf) != 13) break;
        msg = new MessageOrderCancel(buf);
        pool.modify(msg.reference, msg.shares)
        break;

      case MessageType.OrderReplace:
        if (getLocate(buf) != 13) break;
        msg = new MessageOrderReplace(buf);
        order = pool.get(msg.reference)
        if (!order) {
          throw new Error('Order not found')
        }

        pool.add(order.stock, msg.locate, msg.price, msg.shares, msg.referenceNew, order.side)
        pool.delete(msg.reference)
        break

      case MessageType.OrderExecutedWithPrice:
        if (getLocate(buf) != 13) break;
        msg = new MessageOrderExecutedWithPrice(buf);

        console.log(msg)
        pool.modify(msg.reference, msg.shares)
        break

      case MessageType.OrderExecuted:
        if (getLocate(buf) != 13) break;
        msg = new MessageOrderExecuted(buf);

        console.log(msg)
        pool.modify(msg.reference, msg.shares)
        break;

      case MessageType.StockDirectory:
        if (getLocate(buf) != 13) break;
        msg = new MessageStockDirectory(buf);

        pool.stockRegister(msg.locate, msg.stock)
        break;
    }
  }

  return onMessage;
}
