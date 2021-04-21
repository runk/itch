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
