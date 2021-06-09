import assert from 'assert';
import { Order } from '../order';

type Locates = Map<number, string>;
type PoolStore = Map<string, Order>;

export default class Pool {
  private locates: Locates;
  readonly store: PoolStore;
  constructor() {
    this.locates = new Map();
    this.store = new Map();
  }

  stockRegister(locate: number, stock: string) {
    this.locates.set(locate, stock);
  }

  stockLookup(locate: number): string | undefined {
    return this.locates.get(locate);
  }

  add(order: Order) {
    this.store.set(order.reference, order);
    return order;
  }

  delete(reference: string) {
    const ok = this.store.delete(reference);
    assert(ok, 'Order was not deleted');
  }

  modify(reference: string, executedShares: number) {
    const order = this.get(reference);
    if (order === undefined) {
      throw new Error('No orders to modify');
    }

    order.shares -= executedShares;

    if (order.shares === 0) {
      this.delete(order.reference);
      return;
    }

    assert(order.shares > 0, 'Shares <= 0');
  }

  get(reference: string): Order | undefined {
    return this.store.get(reference);
  }
}
