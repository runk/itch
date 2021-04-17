import assert from 'assert';
import Pool from './pool';
import { OrderBook } from './order-book';
import {
  getLocate,
  getTimestampHuman,
  MessageAddOrder,
  MessageOrderCancel,
  MessageOrderDelete,
  MessageOrderExecuted,
  MessageOrderExecutedWithPrice,
  MessageOrderReplace,
  MessageStockDirectory,
} from './parser';
import { MessageType } from './types';
import { Order } from './order';

export default (pool: Pool, book: OrderBook) => {
  const onMessage = (type: MessageType, buf: Buffer) => {
    // Listen for AAPL only
    if (getLocate(buf) != 13) return;
    // if (getTimestampHuman(buf) < '09:40') return;
    if (getTimestampHuman(buf) > '09:35') {
      console.log('hardstop');
      process.exit(1);
    }

    let msg;
    let order: Order | undefined;
    switch (type) {
      case MessageType.StockDirectory:
        msg = new MessageStockDirectory(buf);

        console.log(msg.toString(), msg);
        pool.stockRegister(msg.locate, msg.stock);
        break;

      case MessageType.AddOrder:
      case MessageType.AddOrderWithAttribution:
        msg = new MessageAddOrder(buf);
        // console.log(msg.toString(), msg)
        order = {
          stock: msg.stock,
          locate: msg.locate,
          price: msg.price,
          shares: msg.shares,
          reference: msg.reference,
          side: msg.side,
        };
        pool.add(order);
        book.add(order);
        break;

      case MessageType.OrderDelete:
        msg = new MessageOrderDelete(buf);
        // console.log(msg.toString(), msg)
        pool.delete(msg.reference);
        book.delete(msg.reference);
        break;

      case MessageType.OrderCancel:
        msg = new MessageOrderCancel(buf);
        // console.log(msg.toString(), msg)
        order = pool.get(msg.reference);
        assert(order, 'Order not found');

        // change by reference
        order.shares -= msg.shares;

        if (order.shares === 0) {
          pool.delete(order.reference);
          book.delete(order.reference);
        }

        // pool.modify(msg.reference, msg.shares);
        // book.modify(msg.reference, msg.shares);
        break;

      case MessageType.OrderReplace:
        msg = new MessageOrderReplace(buf);
        order = pool.get(msg.reference);
        if (!order) {
          throw new Error('Order not found');
        }

        // console.log(msg.toString(), msg)
        order = {
          stock: order.stock,
          locate: msg.locate,
          price: msg.price,
          shares: msg.shares,
          reference: msg.referenceNew,
          side: order.side,
        };
        pool.delete(msg.reference);
        book.delete(msg.reference);
        pool.add(order);
        book.add(order);
        break;

      case MessageType.OrderExecutedWithPrice:
        msg = new MessageOrderExecutedWithPrice(buf);

        order = pool.get(msg.reference);
        assert(order, 'Order not found');

        console.log(msg.toString(), order!.price / 1e4, order?.side);

        // change by reference
        order.shares -= msg.shares;

        if (order.shares === 0) {
          pool.delete(order.reference);
          book.delete(order.reference);
        }
        // console.log(msg.toString(), msg)
        console.log(book.getSpread())
        break;

      case MessageType.OrderExecuted:
        msg = new MessageOrderExecuted(buf);

        order = pool.get(msg.reference);
        assert(order, 'Order not found');

        console.log(msg.toString(), order!.price / 1e4, order?.side);

        // change by reference
        order.shares -= msg.shares;

        if (order.shares === 0) {
          pool.delete(order.reference);
          book.delete(order.reference);
        }
        // console.log(msg.toString(), msg)
        console.log(book.getSpread())
        break;
    }
  };

  return onMessage;
};
