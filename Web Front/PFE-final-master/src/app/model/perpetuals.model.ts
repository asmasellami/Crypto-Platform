/*

  export interface Perpetuals {
      currency: {
        value: string;
      };
      price: {
        value: number;
      };
      change: {
        value: number;
      };
      index_price: {
        value: number;
      };
      open_interest: {
        value: number;
        change_notional: number | null;
        change_notional_percentage: number | null;
        change_usd: number | null;
        change_usd_percentage: number | null;
        intensity: number | null;
        notional: number | null;
      };
      volume: {
        value: number;
        change_notional: number | null;
        change_notional_percentage: number | null;
        change_usd: number | null;
        change_usd_percentage: number | null;
        intensity: number | null;
        notional: number | null;
      };
      funding: {
        value: number;
        intensity: number | null;
      };
      next_fr: {
        value: number;
        intensity: number | null;
      };
      yield: {
        value: number;
      };
      next_yield: {
        value: number;
      };
      open_interest_volume: {
        value: number;
        intensity: number | null;
      };
      liquidations: {
        value: {
          long: number;
          short: number;
        };
      };
      ls_ratio: {
        value: number;
      };
      markets: {
        value: string;
      };
      avg_yield: {
        value: {
          "1": number;
          "3": number;
          "7": number;
          "14": number;
          "30": number;
          "90": number;
          "365": number;
        };
      };
      realized_vol: {
        value: {
          "3": number;
          "7": number;
          "30": number;
          "60": number;
          "90": number;
          "180": number;
          "270": number;
          "365": number;
        };
      };
      market_cap: {
        value: number;
      };
      correlation: {
        value: {
          btc: {
            "7": number | null;
            "30": number | null;
          };
          eth: {
            "7": number | null;
            "30": number | null;
          };
        };
      };
      beta: {
        value: {
          btc: {
            "7": number | null;
            "30": number | null;
            intensity_7d?: number;
            intensity_30d?: number;
          };
          eth: {
            "7": number | null;
            "30": number | null;
            intensity_7d?: number;
            intensity_30d?: number;
          };
        };
      };
    }






    export interface Perpetuals {
      currency: { value: string };
      price: { value: number };
      change: { value: number };
      index_price: { value: number };
      open_interest: {
        value: number;
        change_notional: number | null;
        change_notional_percentage: number | null;
        change_usd: number | null;
        change_usd_percentage: number | null;
        intensity: number | null;
        notional: number | null;
      };
      volume: {
        value: number;
        change_notional: number | null;
        change_notional_percentage: number | null;
        change_usd: number | null;
        change_usd_percentage: number | null;
        intensity: number | null;
        notional: number | null;
      };
      funding: {
        value: number;
        intensity: number | null;
      };
      next_fr: {
        value: number;
        intensity: number | null;
      };
      yield: { value: number };
      next_yield: { value: number };
      open_interest_volume: {
        value: number;
        intensity: number | null;
      };
      liquidations: {
        value: {
          long: number;
          short: number;
        };
      };
      ls_ratio: { value: number };
      markets: { value: string };
      avg_yield: {
        value: {
          "1": number;
          "3": number;
          "7": number;
          "14": number;
          "30": number;
          "90": number;
          "365": number;
        };
      };
      realized_vol: {
        value: {
          "3": number;
          "7": number;
          "30": number;
          "60": number;
          "90": number;
          "180": number;
          "270": number;
          "365": number;
        };
      };
      market_cap: { value: number };
      correlation: {
        value: {
          btc: {
            "7": number | null;
            "30": number | null;
          };
          eth: {
            "7": number | null;
            "30": number | null;
          };
        };
      };
      beta: {
        value: {
          btc: {
            "7": number | null;
            "30": number | null;
            intensity_7d?: number;
            intensity_30d?: number;
          };
          eth: {
            "7": number | null;
            "30": number | null;
            intensity_7d?: number;
            intensity_30d?: number;
          };
        };
      };
    }
 */
export interface Perpetuals {

  currency: { value: string };

  price: { value: number };
  change: { value: number };
  index_price: { value: number };
  open_interest: {
    value: number;
    change_notional: number | null;
    change_notional_percentage: number | null;
    change_usd: number | null;
    change_usd_percentage: number | null;
    intensity: number ;
    notional: number ;
  };
  volume: {
    value: number;
    change_notional: number | null;
    change_notional_percentage: number | null;
    change_usd: number | null;
    change_usd_percentage: number | null;
    intensity: number ;
    notional: number | null;
  };
  funding: {
    value: number;
    intensity: number;
  };
  next_fr: {
    value: number;
    intensity: number;
  };
  yield: { value: number };
  next_yield: { value: number };
  open_interest_volume: {
    value: number;
    intensity: number ;
  };
  liquidations: {
    value: {
      long: number;
      short: number;
    };
  };
  ls_ratio: { value: number };
  markets: { value: string };
  avg_yield: {
    value: {
      '1': number;
      '3': number;
      '7': number;
      '14': number;
      '30': number;
      '90': number;
      '365': number;
    };
  };
  realized_vol: {
    value: {
      '3': number;
      '7': number;
      '30': number;
      '60': number;
      '90': number;
      '180': number;
      '270': number;
      '365': number;
    };
  };
  market_cap: { value: number };
  correlation: {
    value: {
      btc: {
        '7': number | null;
        '30': number | null;
      };
      eth: {
        '7': number | null;
        '30': number | null;
      };
    };
  };
  beta: {
    value: {
      btc: {
        '7': number | null;
        '30': number | null;
        intensity_7d?: number;
        intensity_30d?: number;
      };
      eth: {
        '7': number | null;
        '30': number | null;
        intensity_7d?: number;
        intensity_30d?: number;
      };
    };
  };
}
