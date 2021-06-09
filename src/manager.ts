import assert from 'assert';
import Pool from './pool';
import OrderBook from './order-book';
import { Order } from './order';
import {
  isType,
  Message,
  MessageAddOrder,
  MessageAddOrderWithAttribution,
  MessageOrderCancel,
  MessageOrderExecuted,
  MessageOrderExecutedWithPrice,
  MessageOrderReplace,
  MessageStockDirectory,
  MessageType,
} from './parser/types';
import { MessageOrderDelete } from './parser/msg';

export interface OrderManager {
  (msg: Message): Order | null;
}

const manager =
  (pool: Pool, book: OrderBook): OrderManager =>
  <T extends Message>(msg: T): Order | null => {
    let order: Order | undefined;

    if (isType<MessageStockDirectory>(msg, MessageType.StockDirectory)) {
      pool.stockRegister(msg.locate, msg.stock);
      return null;
    }

    if (
      isType<MessageAddOrder>(msg, MessageType.AddOrder) ||
      isType<MessageAddOrderWithAttribution>(
        msg,
        MessageType.AddOrderWithAttribution
      )
    ) {
      order = {
        timestamp: msg.timestamp,
        stock: msg.stock,
        locate: msg.locate,
        price: msg.price,
        shares: msg.shares,
        reference: msg.reference,
        side: msg.side,
      };
      pool.add(order);
      book.add(msg.side, msg.price, msg.shares);
      return order;
    }

    if (isType<MessageOrderDelete>(msg, MessageType.OrderDelete)) {
      order = pool.get(msg.reference);
      assert(order, 'Order not found');

      pool.delete(msg.reference);
      book.remove(order.side, order.price, order.shares);
      return order;
    }

    if (isType<MessageOrderCancel>(msg, MessageType.OrderCancel)) {
      order = pool.get(msg.reference);
      assert(order, 'Order not found');

      pool.modify(msg.reference, msg.shares);
      book.remove(order.side, order.price, msg.shares);
      return order;
    }

    if (isType<MessageOrderReplace>(msg, MessageType.OrderReplace)) {
      order = pool.get(msg.reference);
      if (!order) {
        throw new Error('Order not found');
      }

      const newOrder: Order = {
        // TODO: or original order's timestamp?
        timestamp: msg.timestamp,
        stock: order.stock,
        locate: msg.locate,
        price: msg.price,
        shares: msg.shares,
        reference: msg.referenceNew,
        side: order.side,
      };

      pool.delete(msg.reference);
      pool.add(newOrder);

      book.remove(order.side, order.price, order.shares);
      book.add(order.side, msg.price, msg.shares);
      return newOrder;
    }

    if (
      isType<MessageOrderExecutedWithPrice>(
        msg,
        MessageType.OrderExecutedWithPrice
      )
    ) {
      order = pool.get(msg.reference);
      assert(order, 'Order not found');

      pool.modify(msg.reference, msg.shares);
      // what price to use?
      book.remove(order.side, order.price, msg.shares);
      return order;
    }

    if (isType<MessageOrderExecuted>(msg, MessageType.OrderExecuted)) {
      order = pool.get(msg.reference);
      assert(order, 'Order not found');

      pool.modify(msg.reference, msg.shares);
      book.remove(order.side, order.price, msg.shares);
      return order;
    }

    return null;
  };

export default manager;
