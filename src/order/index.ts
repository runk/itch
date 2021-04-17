export const SIDE_BUY = 'B';
export const SIDE_SELL = 'S';

export type Order = {
  stock: string;
  locate: number;
  price: number;
  shares: number;
  reference: string;
  side: string;
};

export const orderToString = (order: Order) =>
  `${order.side} ${order.price / 1e4}\t${order.shares}`;
