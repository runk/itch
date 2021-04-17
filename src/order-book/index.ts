import Pool, { Order, SIDE_BUY } from '../pool';

export class OrderBook {
  buy: Order[];
  sell: Order[];
  limit?: number;

  constructor(limit?: number) {
    this.buy = [];
    this.sell = [];
    this.limit = limit;
  }

  add(order: Order) {
    if (order.side == 'S') {
      this.sell.push(order);
      this.sell.sort((a, b) => a.price - b.price);
    } else {
      this.buy.push(order);
      this.buy.sort((a, b) => b.price - a.price);
    }

    if (this.limit !== undefined) {
      this.sell.splice(this.limit);
      this.buy.splice(this.limit);
    }
  }

  delete(reference: string) {
    let index = this.buy.findIndex((order) => order.reference === reference);
    if (index > -1) {
      this.buy.splice(index, 1);
      return;
    }

    index = this.sell.findIndex((order) => order.reference === reference);
    if (index > -1) {
      this.sell.splice(index, 1);
      return;
    }

    throw new Error('Cannot find order to delete');
  }

  modify(reference: string, shares: number) {
    let index = this.buy.findIndex((order) => order.reference === reference);
    if (index > -1) {
      if (this.buy[index].shares === shares) {
        this.buy.splice(index, 1);
      } else {
        this.buy[index].shares -= shares;
      }
      return;
    }

    index = this.sell.findIndex((order) => order.reference === reference);
    if (index > -1) {
      if (this.sell[index].shares === shares) {
        this.sell.splice(index, 1);
      } else {
        this.sell[index].shares -= shares;
      }
      return;
    }

    throw new Error('Cannot find order to modify');
  }

  toString() {
    let out = '';
    out += this.buy
      .reverse()
      .map((order) => `${order.side} ${order.price / 1e4}\t${order.shares}`)
      .join('\n');
    out += '\n-----\n';
    out += this.sell
      .map((order) => `${order.side} ${order.price / 1e4}\t${order.shares}`)
      .join('\n');
    return out;
  }
}

export const poolToBook = (pool: Pool, stock: string, limit?: number) => {
  const sell: Order[] = [];
  const buy: Order[] = [];
  for (const order of pool.store.values()) {
    if (order.stock !== stock) continue;
    if (order.side === SIDE_BUY) {
      buy.push(order);
    } else {
      sell.push(order);
    }
  }

  sell.sort((a, b) => a.price - b.price);
  buy.sort((a, b) => b.price - a.price);

  if (limit !== undefined) {
    sell.splice(limit);
    buy.splice(limit);
  }
  return { sell, buy };
};

export const bookToString = (book: OrderBook): string => {
  let out = '';
  out += book.buy
    .reverse()
    .map((order) => `B ${order.price / 1e4}\t${order.shares}`)
    .join('\n');
  out += '\n-----\n';
  out += book.sell
    .map((order) => `S ${order.price / 1e4}\t${order.shares}`)
    .join('\n');
  return out;
};
