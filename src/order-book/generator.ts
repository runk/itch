import Pool from '../pool';

export interface Level {
  price: number;
  shares: number;
  orders: number;
}

export default (pool: Pool, depth = 10): { bids: Level[]; asks: Level[] } => {
  const bids: Level[] = [];
  const asks: Level[] = [];
  let level;

  // TODO: use index for faster price lookups
  pool.store.forEach((order) => {
    if (order.side === 'S') {
      level = asks.find((ask) => ask.price === order.price);
      if (level) {
        level.shares += order.shares;
        level.orders++;
      } else {
        asks.push({ price: order.price, shares: order.shares, orders: 1 });
      }
    } else {
      level = bids.find((ask) => ask.price === order.price);
      if (level) {
        level.shares += order.shares;
        level.orders++;
      } else {
        bids.push({ price: order.price, shares: order.shares, orders: 1 });
      }
    }
  });

  // TODO: do as part of the loop?
  asks.sort((a, b) => (a.price > b.price ? 1 : -1)).splice(depth);
  bids.sort((a, b) => (a.price > b.price ? -1 : 1)).splice(depth);

  return {
    bids,
    asks,
  };
};
