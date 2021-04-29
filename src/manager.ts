import assert from 'assert';
import Pool from './pool';
import { OrderBook } from './order-book';
import {
  Message,
  MessageAddOrder,
  MessageAddOrderWithAttribution,
  MessageOrderCancel,
  MessageOrderDelete,
  MessageOrderExecuted,
  MessageOrderExecutedWithPrice,
  MessageOrderReplace,
  MessageStockDirectory,
} from './parser/msg';
import { Order } from './order';

export default (pool: Pool, book: OrderBook) => (msg: Message) => {
  let order: Order | undefined;
  if (msg instanceof MessageStockDirectory) {
    pool.stockRegister(msg.locate, msg.stock);
    return;
  }

  if (
    msg instanceof MessageAddOrder ||
    msg instanceof MessageAddOrderWithAttribution
  ) {
    order = {
      stock: msg.stock,
      locate: msg.locate,
      price: msg.price,
      shares: msg.shares,
      reference: msg.reference,
      side: msg.side,
    };
    pool.add(order);
    book.add(msg.side, msg.price, msg.shares);
    return;
  }

  if (msg instanceof MessageOrderDelete) {
    order = pool.get(msg.reference);
    assert(order, 'Order not found');

    pool.delete(msg.reference);
    book.remove(order.side, order.price, order.shares);
    return;
  }

  if (msg instanceof MessageOrderCancel) {
    order = pool.get(msg.reference);
    assert(order, 'Order not found');

    pool.modify(msg.reference, msg.shares);
    book.remove(order.side, order.price, msg.shares);
    return;
  }

  if (msg instanceof MessageOrderReplace) {
    order = pool.get(msg.reference);
    if (!order) {
      throw new Error('Order not found');
    }

    pool.delete(msg.reference);
    pool.add({
      stock: order.stock,
      locate: msg.locate,
      price: msg.price,
      shares: msg.shares,
      reference: msg.referenceNew,
      side: order.side,
    });

    book.remove(order.side, order.price, order.shares);
    book.add(order.side, msg.price, msg.shares);
    return;
  }

  if (msg instanceof MessageOrderExecutedWithPrice) {
    order = pool.get(msg.reference);
    assert(order, 'Order not found');

    pool.modify(msg.reference, msg.shares);
    // what price to use?
    book.remove(order.side, order.price, msg.shares);
    return;
  }

  if (msg instanceof MessageOrderExecuted) {
    order = pool.get(msg.reference);
    assert(order, 'Order not found');

    pool.modify(msg.reference, msg.shares);
    book.remove(order.side, order.price, msg.shares);
    return;
  }
};
