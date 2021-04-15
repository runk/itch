import Pool, { Order, SIDE_BUY } from '../pool';

export type OrderBook = {
  buy: Order[];
  sell: Order[];
};

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
  out += book.buy.reverse().map(order => `B ${order.price/1e4}\t${order.shares}`).join('\n')
  out += '\n-----\n';
  out += book.sell.map(order => `S ${order.price/1e4}\t${order.shares}`).join('\n');
  return out;
}
