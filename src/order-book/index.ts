import { SIDE_SELL, Order, orderToString } from '../order';

// type Level {
//   price
// }

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
    if (order.side == SIDE_SELL) {
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
        // bad
        this.buy[index].shares -= shares;
      }
      return;
    }

    index = this.sell.findIndex((order) => order.reference === reference);
    if (index > -1) {
      if (this.sell[index].shares === shares) {
        this.sell.splice(index, 1);
      } else {
        // bad
        this.sell[index].shares -= shares;
      }
      return;
    }

    throw new Error(`Cannot find order to modify, ref: ${reference}`);
  }

  toString() {
    let out = '';
    out += this.buy.reverse().map(orderToString).join('\n');
    out += '\n-----\n';
    out += this.sell.map(orderToString).join('\n');
    return out;
  }

  /**
   * @returns bid-ask spread
   */
  getSpread() {
    return [this.buy[0].price, this.sell[0].price];
  }
}
