 export interface Options {
  ticker: {
    value: string;
  };
  currency: {
    value: string;
  };
  expiry: {
    value: string;
  };
  underlying_price: {
    value: number;
  };
  change: {
    value: number;
    intensity: number;
    notional: number;
    change_usd: number;
    change_usd_percentage: number;
    change_notional: number;
    change_notional_percentage: number;
  };
  open_interest: {
    value: number;
    intensity: number;
    notional: number;
    change_usd: number;
    change_usd_percentage: number;
    change_notional: number;
    change_notional_percentage: number;
  };
  volume: {
    value: number;
    intensity: number;
    notional: number;
    change_usd: number;
    change_usd_percentage: number;
    change_notional: number;
    change_notional_percentage: number;
  };
  atm_vol: {
    value: number;
    intensity: number;
    change_usd: number | null;
    change_usd_percentage: number | null;
    change_notional: number | null;
    change_notional_percentage: number | null;
  };
  basis: {
    value: number;
    intensity: number;
    change_usd: number | null;
    change_usd_percentage: number | null;
    change_notional: number | null;
    change_notional_percentage: number | null;
  };
  _25_delta_risk_reversal: {
    value: number;
    intensity: number;
    change_usd: number | null;
    change_usd_percentage: number | null;
    change_notional: number | null;
    change_notional_percentage: number | null;
  };
  _25_delta_butterfly: {
    value: number;
    intensity: number;
    change_usd: number | null;
    change_usd_percentage: number | null;
    change_notional: number | null;
    change_notional_percentage: number | null;
  };
  open_interest_volume: {
    value: number;
    intensity: number;
    change_usd: number | null;
    change_usd_percentage: number | null;
    change_notional: number | null;
    change_notional_percentage: number | null;
  };
 /* market: {
    value: string[];
  };*/
}
