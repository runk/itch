import Pool, { Order } from ".";
import { getLocate, MessageAddOrder, MessageOrderCancel, MessageOrderDelete, MessageOrderExecuted, MessageOrderExecutedWithPrice, MessageOrderReplace, MessageStockDirectory } from "../parser";
import { MessageType } from "../types";

export default (pool: Pool) => {
  const onMessage = (type: MessageType, buf: Buffer) => {
    if (getLocate(buf) != 13) return;

    let msg, order;
    switch (type) {
      case MessageType.AddOrder:
      case MessageType.AddOrderWithAttribution:
        msg = new MessageAddOrder(buf)
        pool.add(msg.stock, msg.locate, msg.price, msg.shares, msg.reference, msg.side);
        break;

      case MessageType.OrderDelete:
        msg = new MessageOrderDelete(buf);
        pool.delete(msg.reference)
        break;

      case MessageType.OrderCancel:
        msg = new MessageOrderCancel(buf);
        pool.modify(msg.reference, msg.shares)
        break;

      case MessageType.OrderReplace:
        msg = new MessageOrderReplace(buf);
        order = pool.get(msg.reference)
        if (!order) {
          throw new Error('Order not found')
        }

        pool.add(order.stock, msg.locate, msg.price, msg.shares, msg.referenceNew, order.side)
        pool.delete(msg.reference)
        break

      case MessageType.OrderExecutedWithPrice:
        msg = new MessageOrderExecutedWithPrice(buf);

        console.log(msg.toString())
        pool.modify(msg.reference, msg.shares)
        break

      case MessageType.OrderExecuted:
        msg = new MessageOrderExecuted(buf);

        console.log(msg.toString())
        pool.modify(msg.reference, msg.shares)
        break;

      case MessageType.StockDirectory:
        msg = new MessageStockDirectory(buf);

        pool.stockRegister(msg.locate, msg.stock)
        break;
    }
  }

  return onMessage;
}
