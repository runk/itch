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
