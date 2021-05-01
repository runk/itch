import Pool from '../pool';

interface Level {
  price: number;
  shares: number;
  orders: number;
}

export default (pool: Pool): string => {
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

  let out = '';
  asks.sort((a, b) => (a.price > b.price ? 1 : -1));
  bids.sort((a, b) => (a.price > b.price ? 1 : -1));

  for (level of bids) {
    out += `B ${(level.price / 1e4).toFixed(2)}: ${level.shares} (${
      level.orders
    })\n`;
  }
  out += '-----\n';
  for (level of asks) {
    out += `S ${(level.price / 1e4).toFixed(2)}: ${level.shares} (${
      level.orders
    })\n`;
  }
  return out;
};
