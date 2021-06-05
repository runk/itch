export type Side = 'B' | 'S';

export type Order = {
  stock: string;
  locate: number;
  price: number;
  shares: number;
  reference: string;
  side: Side;
  timestamp: number;
};

export const orderToString = (order: Order) =>
  `${order.side} ${order.price / 1e4}\t${order.shares}`;
