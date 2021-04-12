
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
}

export type MessageHeader = {
  type: MessageType,
  locate: number,
  tracking: number,
  timestamp: number,
}

export type MessageBody = Record<string, string | number>;

export interface Message {
  header: MessageHeader,
  body: MessageBody
}
