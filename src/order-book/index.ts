import assert from 'assert';
import { Side } from '../order';

type Shares = number;
type Price = number;

const toArray = (map: Map<Price, Shares>): Price[] => {
  return Array<Price>(...map.keys()).sort((a, b) => (a > b ? 1 : -1));
};

const min = (arr: Map<Price, Shares>) => Math.min(...arr.keys());
const max = (arr: Map<Price, Shares>) => Math.max(...arr.keys());

const SIDE_BUY = 'B';
const SIDE_SELL = 'S';

export default class OrderBook {
  depth?: number;

  buy: Map<Price, Shares>;
  sell: Map<Price, Shares>;

  bid: number;
  ask: number;

  constructor(depth?: number) {
    this.depth = depth;

    this.bid = -Infinity;
    this.ask = Infinity;

    this.buy = new Map<Price, Shares>();
    this.sell = new Map<Price, Shares>();
  }

  /**
   * Adds liquidity to the order book
   *
   * @param side
   * @param price
   * @param volume
   */
  add(side: Side, price: Price, volume: Shares) {
    if (side == SIDE_BUY) this.bid = Math.max(this.bid, price);
    if (side == SIDE_SELL) this.ask = Math.min(this.ask, price);

    const container = side === SIDE_SELL ? this.sell : this.buy;
    const current = container.get(price) || 0;
    container.set(price, current + volume);
  }

  /**
   * Removes liquidity from the order book
   *
   * @param side
   * @param price
   * @param volume
   */
  remove(side: Side, price: Price, volume: Shares) {
    const container = side === SIDE_SELL ? this.sell : this.buy;
    const current = container.get(price) || 0;
    assert(
      current >= volume,
      `Cannot remove more ${volume} volume than ${current} total at this level ${price}`,
    );

    if (volume === current) {
      container.delete(price);
    } else {
      container.set(price, current - volume);
    }

    if (side == SIDE_BUY && price == this.bid) {
      this.bid = max(this.buy);
    } else if (side == SIDE_SELL && price == this.ask) {
      this.ask = min(this.sell);
    }
  }

  toString() {
    let out = '';
    const bidLevels = toArray(this.buy).slice(0, this.depth);
    const askLevels = toArray(this.sell).slice(0, this.depth);

    for (const level of bidLevels) {
      out += `B ${(level / 1e4).toFixed(2)}: ${this.buy.get(level)}\n`;
    }
    out += '-----\n';
    for (const level of askLevels) {
      out += `S ${(level / 1e4).toFixed(2)}: ${this.sell.get(level)}\n`;
    }
    return out;
  }

  /**
   * @returns bid-ask spread
   */
  getSpread(): Price[] {
    const totalBids = this.buy.size;
    // TODO: make it fast
    return [toArray(this.buy)[totalBids - 1], toArray(this.sell)[0]];
  }
}
