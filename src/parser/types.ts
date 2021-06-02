import { Side } from '../order';

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

export interface Message {
  type: MessageType;
  locate: number;
  tracking: number;
  timestamp: number;
}

export interface MessageAddOrder extends Message {
  type: MessageType.AddOrder;
  reference: string;
  side: Side;
  shares: number;
  stock: string;
  price: number;
}

export interface MessageOrderReplace extends Message {
  type: MessageType.OrderReplace;
  reference: string;
  referenceNew: string;
  shares: number;
  price: number;
}

export interface MessageAddOrderWithAttribution extends Message {
  type: MessageType.AddOrderWithAttribution;
  reference: string;
  side: Side;
  shares: number;
  stock: string;
  price: number;
}

export interface MessageSystem extends Message {
  type: MessageType.System;
  eventCode: string;
}

export interface MessageStockDirectory extends Message {
  type: MessageType.StockDirectory;
  stock: string;
}

export interface MessageOrderExecuted extends Message {
  type: MessageType.OrderExecuted;
  reference: string;
  shares: number;
  match: string;
}

export interface MessageOrderExecutedWithPrice extends Message {
  type: MessageType.OrderExecutedWithPrice;
  reference: string;
  shares: number;
  match: string;
  printable: number;
  price: number;
}

export interface MessageOrderCancel extends Message {
  type: MessageType.OrderCancel;
  reference: string;
  shares: number;
}
