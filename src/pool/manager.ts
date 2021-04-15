import { assert } from 'console';
import { getTokenSourceMapRange } from 'typescript';
import Pool, { Order } from '.';
import { bookToString, poolToBook } from '../order-book';
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
  MessageTradeCross,
} from '../parser';
import { MessageType } from '../types';

export default (pool: Pool) => {
  const onMessage = (type: MessageType, buf: Buffer) => {
    // Listen for AAPL only
    if (getLocate(buf) != 13) return;
    // if (getTimestampHuman(buf) < '09:40') return;
    if (getTimestampHuman(buf) > '09:35') {
      console.log('hardstop');
      process.exit(1);
    }

    let msg, order;
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
        pool.add(
          msg.stock,
          msg.locate,
          msg.price,
          msg.shares,
          msg.reference,
          msg.side
        );
        break;

      case MessageType.OrderDelete:
        msg = new MessageOrderDelete(buf);
        // console.log(msg.toString(), msg)
        pool.delete(msg.reference);
        break;

      case MessageType.OrderCancel:
        msg = new MessageOrderCancel(buf);
        // console.log(msg.toString(), msg)
        pool.modify(msg.reference, msg.shares);
        break;

      case MessageType.OrderReplace:
        msg = new MessageOrderReplace(buf);
        order = pool.get(msg.reference);
        if (!order) {
          throw new Error('Order not found');
        }

        // console.log(msg.toString(), msg)
        pool.add(
          order.stock,
          msg.locate,
          msg.price,
          msg.shares,
          msg.referenceNew,
          order.side
        );
        pool.delete(msg.reference);
        break;

      case MessageType.OrderExecutedWithPrice:
        msg = new MessageOrderExecutedWithPrice(buf);

        console.log(msg.toString(), msg);
        pool.modify(msg.reference, msg.shares);
        break;

      case MessageType.OrderExecuted:
        msg = new MessageOrderExecuted(buf);

        order = pool.get(msg.reference);
        assert(order);

        console.log(msg.toString(), order!.price / 1e4, order?.side);

        // console.log(msg.toString(), msg)
        pool.modify(msg.reference, msg.shares);
        console.log(bookToString(poolToBook(pool, 'AAPL    ', 10)))
        break;

      case MessageType.TradeCross:
        msg = new MessageTradeCross(buf);

        // console.log(msg.toString(), msg)
        break;
    }
  };

  return onMessage;
};
