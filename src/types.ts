export enum MessageType {
  // System
  System = 'S',
  StockDirectory = 'R',

  // Adding
  AddOrder = 'A',
  AddOrderWithAttribution = 'F',

  // Modifying
  OrderExecuted = 'E',
  OrderExecutedWithPrice = 'C',

  OrderCancel = 'X',
  OrderDelete = 'D',

  OrderReplace = 'U',

  // Trade
  TradeCross = 'Q',
  TradeNonCross = 'P',
}

export type MessageHeader = {
  type: MessageType;
  locate: number;
  tracking: number;
  timestamp: number;
};

// export interface MessageBody =
//   reference?: string;
//   price?: number;
//   shares?: number;
//   [key: string]: string | number;
// }

export interface Message<T = unknown> {
  header: MessageHeader;
  body: T;
}
