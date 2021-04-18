import assert from 'assert';

type Shares = number;
type Price = number;


const toArray = (map: Map<Price, Shares>): Price[] => {
  return Array<Price>(...map.keys()).sort((a, b) => a - b);
}

export class SimpleOrderBook {
  limit?: number;

  buy: Map<Price, Shares>;
  sell: Map<Price, Shares>;

  constructor(limit?: number) {
    this.limit = limit;

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
  add(side: string, price: Price, volume: Shares) {
    const container = (side === 'S') ? this.sell : this.buy;
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
  remove(side: string, price: Price, volume: Shares) {
    const container = (side === 'S') ? this.sell : this.buy;
    const current = container.get(price) || 0;
    assert(current >= volume, "Cannot remove more volume than total at this level")

    if (volume === current) {
      container.delete(price);
    } else {
      this.sell.set(price, current - volume);
    }
  }

  toString() {
    let out = '';
    const bidLevels = toArray(this.buy).slice(0, this.limit);
    const askLevels = toArray(this.sell).slice(0, this.limit);

    for (const level of bidLevels) {
      out += `B ${(level / 1e4).toFixed(2)}: ${this.buy.get(level)}\n`
    }
    out += '-----\n';
    for (const level of askLevels) {
      out += `S ${(level / 1e4).toFixed(2)}: ${this.sell.get(level)}\n`
    }
    return out;
  }

  /**
   * @returns bid-ask spread
   */
  getSpread(): Price[] {
    const totalBids = this.buy.size;
    return [toArray(this.buy)[totalBids - 1], toArray(this.sell)[0]];
  }
}
