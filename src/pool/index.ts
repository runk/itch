import { assert } from "console";

type Order = {
  stock: string
  locate: number
  price: number
  shares: number
  reference: string
  side: 0 | 1
}

type Locates = Map<number, string>;
type PoolStore = Map<string, Order>

export default class Pool {
  private locates: Locates;
  private store: PoolStore
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

  add(stock: string, locate: number, price: number, shares: number, reference: string, side: 0 | 1) {
    this.store.set(reference, {
      stock,
      locate,
      price,
      shares,
      // TODO: do not need?
      reference,
      side,
    });
  }

  delete(reference: string) {
    this.store.delete(reference)
  }

  modify(reference: string, executedShares: number) {
    const order = this.get(reference);
    if (order === undefined) {
      throw new Error('No orders to modify');
    }

    if (order.shares === executedShares) {
      this.delete(order.reference);
      return;
    }

    order.shares -= executedShares
    assert(order.shares > 0);
  }

  get(reference: string): Order | undefined {
    return this.store.get(reference)
  }
}
