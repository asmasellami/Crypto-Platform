export interface Futures {

  ticker: {
    value: string;
  };
  currency: {
    value: string;
  };
  expiry: {
    value: string;
  };
  price: {
    value: number;
  };
  change: {
    value: number;
  };
  open_interest: {
    value: number;
    intensity: number;
    notional: number;
    change_usd_percentage: number;
    change_usd: number;
    change_notional: number;
    change_notional_percentage: number;
    change_intensity: number;
  };
  volume: {
    value: number;
    intensity: number;
    notional: number;
    change_usd_percentage: number;
    change_usd: number;
    change_notional: number;
    change_notional_percentage: number;
  };
  yield: {
    value: number;
    change: number;
    intensity: number;
  };
  basis: {
    value: number;
   /*  change: number; */
    intensity: number;
    notional: number;
    change_usd_percentage: number;
    change_usd: number;
    change_notional: number;
    change_notional_percentage: number;
  };



  open_interest_volume: {
    value: number;
    intensity: number;
    notional: number;
    change_usd_percentage: number;
    change_usd: number;
    change_notional: number;
    change_notional_percentage: number;
  };

 /* market: {
    value: string[];
  };*/
}


