import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Perpetuals } from '../model/perpetuals.model';
import { catchError, map, switchMap } from 'rxjs/operators';
import {  Futures } from '../model/futures.model';
import { Subject, Observable, interval, throwError } from 'rxjs';
import { Alert} from '../model/alert.model';
import { Options } from '../model/options.model';
import { FutureData } from '../model/futuresdata.model';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { FuturesChartData } from '../model/FuturesChartData.model';
import { OptionsChartData } from '../model/OptionsChartData.model';
import { PerpetualsChartData } from '../model/perpetualsChartData.model';
@Injectable({
  providedIn: 'root',
})
export class GlobalDataTableService {
  private url = './assets/global_data_table.json';

  private apiUrl = 'https://api.coinbase.com/v2/prices/';

  baseUrl: string = 'http://localhost:8081/users';

  private apiFut = 'https://be.laevitas.ch/pfe/futures';
  private apiOpt = 'https://be.laevitas.ch/pfe/options';
  private apiPerp = 'https://be.laevitas.ch/pfe/perpetuals';
  private secret = 'AS845fsd,asd//6';
  private OptionData: Subject<Options[]> = new Subject<Options[]>();

  private dataSubject: Subject<Futures[]> = new Subject<Futures[]>();

  private perpetualSubject: Subject<Perpetuals[]> = new Subject<Perpetuals[]>();

  private socket$: WebSocketSubject<any>;

  constructor(private http: HttpClient) {
    this.socket$ = webSocket(`${this.baseUrl}/ws`);
  }

  /****Futures Data*/
  getFutures(): Observable<Futures[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Secret': this.secret
    });
    return this.http.get<any[]>(this.apiFut, { headers }).pipe(
      map(data => this.transformFuturesData(data))
    );
  }

  getFuturesUpdates(): Observable<Options[]> {
    return this.socket$.multiplex(
      () => ({ subscribe: 'futures' }),
      () => ({ unsubscribe: 'futures' }),
      message => message.type === 'futures'
    );
  }
  private transformFuturesData(data: any[]): Futures[] {
    const transformedData: Futures[] = [];
    data.forEach((futureArray) => {
      const future: Futures = {
        ticker: { value: futureArray.find((item: any) => item.name === 'ticker').value },
        currency: { value: futureArray.find((item: any) => item.name === 'currency').value },
        expiry: { value: futureArray.find((item: any) => item.name === 'expiry').value },
        price: { value: parseFloat(futureArray.find((item: any) => item.name === 'price').value) },
        change: { value: parseFloat(futureArray.find((item: any) => item.name === 'change').value) },
        open_interest: {
          value: parseFloat(futureArray.find((item: any) => item.name === 'open_interest').value),
          intensity: parseFloat(futureArray.find((item: any) => item.name === 'open_interest').intensity),
          notional: parseFloat(futureArray.find((item: any) => item.name === 'open_interest').notional),
          change_usd_percentage: parseFloat(futureArray.find((item: any) => item.name === 'open_interest').change_usd_percentage),
          change_usd: parseFloat(futureArray.find((item: any) => item.name === 'open_interest').change_usd),
          change_notional: parseFloat(futureArray.find((item: any) => item.name === 'open_interest').change_notional),
          change_notional_percentage: parseFloat(futureArray.find((item: any) => item.name === 'open_interest').change_notional_percentage),
          change_intensity: parseFloat(futureArray.find((item: any) => item.name === 'open_interest').change_intensity),
        },
        volume: {
          value: parseFloat(futureArray.find((item: any) => item.name === 'volume').value),
          intensity: parseFloat(futureArray.find((item: any) => item.name === 'volume').intensity),
          notional: parseFloat(futureArray.find((item: any) => item.name === 'volume').notional),
          change_usd_percentage: parseFloat(futureArray.find((item: any) => item.name === 'volume').change_usd_percentage),
          change_usd: parseFloat(futureArray.find((item: any) => item.name === 'volume').change_usd),
          change_notional: parseFloat(futureArray.find((item: any) => item.name === 'volume').change_notional),
          change_notional_percentage: parseFloat(futureArray.find((item: any) => item.name === 'volume').change_notional_percentage),
        },
        yield: {
          value: parseFloat(futureArray.find((item: any) => item.name === 'yield').value),
          change: parseFloat(futureArray.find((item: any) => item.name === 'yield').change),
          intensity: parseFloat(futureArray.find((item: any) => item.name === 'yield').intensity),
        },
        basis: {
          value: parseFloat(futureArray.find((item: any) => item.name === 'basis').value),

          intensity: parseFloat(futureArray.find((item: any) => item.name === 'basis').intensity),
          notional: parseFloat(futureArray.find((item: any) => item.name === 'basis').notional),
          change_usd_percentage: parseFloat(futureArray.find((item: any) => item.name === 'basis').change_usd_percentage),
          change_usd: parseFloat(futureArray.find((item: any) => item.name === 'basis').change_usd),
          change_notional: parseFloat(futureArray.find((item: any) => item.name === 'basis').change_notional),
          change_notional_percentage: parseFloat(futureArray.find((item: any) => item.name === 'basis').change_notional_percentage),
        },

        open_interest_volume: {
          value: parseFloat(futureArray.find((item: any) => item.name === 'open_interest_volume').value),
          intensity: parseFloat(futureArray.find((item: any) => item.name === 'open_interest_volume').intensity),
          notional: parseFloat(futureArray.find((item: any) => item.name === 'open_interest_volume').notional),
          change_usd_percentage: parseFloat(futureArray.find((item: any) => item.name === 'open_interest_volume').change_usd_percentage),
          change_usd: parseFloat(futureArray.find((item: any) => item.name === 'open_interest_volume').change_usd),
          change_notional: parseFloat(futureArray.find((item: any) => item.name === 'open_interest_volume').change_notional),
          change_notional_percentage: parseFloat(futureArray.find((item: any) => item.name === 'open_interest_volume').change_notional_percentage),
        },

      };
      transformedData.push(future);
    });

    return transformedData;
  }


  /***Options data **/
  getOptions(): Observable<Options[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Secret': this.secret
    });

    return this.http.get<any[]>(this.apiOpt, { headers }).pipe(
      map(data => this.transformOptions(data))
    );
  }

  getOptionsUpdates(): Observable<Options[]> {
    return this.socket$.multiplex(
      () => ({ subscribe: 'options' }),
      () => ({ unsubscribe: 'options' }),
      message => message.type === 'options'
    );
  }

  private transformOptions(data: any[]): Options[] {
    return data.map(item => ({
      ticker: { value: item.find((i: any) => i.name === 'ticker')?.value || '' },
      currency: { value: item.find((i: any)=> i.name === 'currency')?.value || '' },
      expiry: { value: item.find((i: any)=> i.name === 'expiry')?.value || '' },
      underlying_price: { value: parseFloat(item.find((i: any)=> i.name === 'underlying_price')?.value || 0) },
      change: {
        value: parseFloat(item.find((i: any) => i.name === 'change')?.value || 0),
        intensity: parseFloat(item.find((i: any)=> i.name === 'change')?.intensity || 0),
        notional: parseFloat(item.find((i: any)=> i.name === 'change')?.notional || 0),
        change_usd: parseFloat(item.find((i: any)=> i.name === 'change')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === 'change')?.change_usd_percentage || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === 'change')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any)=> i.name === 'change')?.change_notional_percentage || 0)
      },
      open_interest: {
        value: parseFloat(item.find((i: any) => i.name === 'open_interest')?.value || 0),
        intensity: parseFloat(item.find((i: any) => i.name === 'open_interest')?.intensity || 0),
        notional: parseFloat(item.find((i: any)=> i.name === 'open_interest')?.notional || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === 'open_interest')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === 'open_interest')?.change_usd_percentage || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === 'open_interest')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any) => i.name === 'open_interest')?.change_notional_percentage || 0)
      },
      volume: {
        value: parseFloat(item.find((i: any) => i.name === 'volume')?.value || 0),
        intensity: parseFloat(item.find((i: any)=> i.name === 'volume')?.intensity || 0),
        notional: parseFloat(item.find((i: any)=> i.name === 'volume')?.notional || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === 'volume')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === 'volume')?.change_usd_percentage || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === 'volume')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any) => i.name === 'volume')?.change_notional_percentage || 0)
      },
      atm_vol: {
        value: parseFloat(item.find((i: any) => i.name === 'atm_vol')?.value || 0),
        intensity: parseFloat(item.find((i: any) => i.name === 'atm_vol')?.intensity || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === 'atm_vol')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === 'atm_vol')?.change_usd_percentage || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === 'atm_vol')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any)=> i.name === 'atm_vol')?.change_notional_percentage || 0)
      },
      basis: {
        value: parseFloat(item.find((i: any) => i.name === 'basis')?.value || 0),
        intensity: parseFloat(item.find((i: any)=> i.name === 'basis')?.intensity || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === 'basis')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any)=> i.name === 'basis')?.change_usd_percentage || 0),
        change_notional: parseFloat(item.find((i: any)=> i.name === 'basis')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any) => i.name === 'basis')?.change_notional_percentage || 0)
      },
      _25_delta_risk_reversal: {
        value: parseFloat(item.find((i: any)=> i.name === '_25_delta_risk_reversal')?.value || 0),
        intensity: parseFloat(item.find((i: any) => i.name === '_25_delta_risk_reversal')?.intensity || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === '_25_delta_risk_reversal')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === '_25_delta_risk_reversal')?.change_usd_percentage || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === '_25_delta_risk_reversal')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any) => i.name === '_25_delta_risk_reversal')?.change_notional_percentage || 0)
      },
      _25_delta_butterfly: {
        value: parseFloat(item.find((i: any) => i.name === '_25_delta_butterfly')?.value || 0),
        intensity: parseFloat(item.find((i: any) => i.name === '_25_delta_butterfly')?.intensity || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === '_25_delta_butterfly')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === '_25_delta_butterfly')?.change_usd_percentage || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === '_25_delta_butterfly')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any) => i.name === '_25_delta_butterfly')?.change_notional_percentage || 0)
      },
      open_interest_volume: {
        value: parseFloat(item.find((i: any)=> i.name === 'open_interest_volume')?.value || 0),
        intensity: parseFloat(item.find((i: any) => i.name === 'open_interest_volume')?.intensity || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === 'open_interest_volume')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === 'open_interest_volume')?.change_usd_percentage || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === 'open_interest_volume')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any)=> i.name === 'open_interest_volume')?.change_notional_percentage || 0)
      },
      /*market: {
        value: item.find(i => i.name === 'market')?.value.split(',') || []
      }*/
    }));
  }


/*   getPerpetuals(): Observable<Perpetual[]> {
    return this.http.get<Perpetual[]>(this.url);
  }
  */

  //Perpetuals data

  /***Perpetuals data **/
  getPerpetuals(): Observable<Perpetuals[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Secret': this.secret
    });

    return this.http.get<any[]>(this.apiPerp, { headers }).pipe(
      map(data => this.transformPerpetuals(data))
    );
  }

  getPerpetualsUpdates(): Observable<Perpetuals[]> {
    return this.socket$.multiplex(
      () => ({ subscribe: 'perpetuals' }),
      () => ({ unsubscribe: 'perpetuals' }),
      message => message.type === 'perpetuals'
    );
  }
  private transformPerpetuals(data: any[]): Perpetuals[] {
    return data.map(item => ({
      currency: { value: item.find((i: any) => i.name === 'currency')?.value || '' },
      price: { value: parseFloat(item.find((i: any) => i.name === 'price')?.value || 0) },
      change: { value: parseFloat(item.find((i: any) => i.name === 'change')?.value || 0) },
      index_price: { value: parseFloat(item.find((i: any) => i.name === 'index_price')?.value || 0) },
      open_interest: {
        value: parseFloat(item.find((i: any) => i.name === 'open_interest')?.value || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === 'open_interest')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any) => i.name === 'open_interest')?.change_notional_percentage || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === 'open_interest')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === 'open_interest')?.change_usd_percentage || 0),
        intensity: parseFloat(item.find((i: any) => i.name === 'open_interest')?.intensity || 0),
        notional: parseFloat(item.find((i: any) => i.name === 'open_interest')?.notional || 0)
      },
      volume: {
        value: parseFloat(item.find((i: any) => i.name === 'volume')?.value || 0),
        change_notional: parseFloat(item.find((i: any) => i.name === 'volume')?.change_notional || 0),
        change_notional_percentage: parseFloat(item.find((i: any) => i.name === 'volume')?.change_notional_percentage || 0),
        change_usd: parseFloat(item.find((i: any) => i.name === 'volume')?.change_usd || 0),
        change_usd_percentage: parseFloat(item.find((i: any) => i.name === 'volume')?.change_usd_percentage || 0),
        intensity: parseFloat(item.find((i: any) => i.name === 'volume')?.intensity || 0),
        notional: parseFloat(item.find((i: any) => i.name === 'volume')?.notional || 0)
      },
      funding: {
        value: parseFloat(item.find((i: any) => i.name === 'funding')?.value || 0),
        intensity: parseFloat(item.find((i: any) => i.name === 'funding')?.intensity || 0)
      },
      next_fr: {
        value: parseFloat(item.find((i: any) => i.name === 'next_fr')?.value || 0),
        intensity: parseFloat(item.find((i: any) => i.name === 'next_fr')?.intensity || 0)
      },
      yield: { value: parseFloat(item.find((i: any) => i.name === 'yield')?.value || 0) },
      next_yield: { value: parseFloat(item.find((i: any) => i.name === 'next_yield')?.value || 0) },
      open_interest_volume: {
        value: parseFloat(item.find((i: any) => i.name === 'open_interest_volume')?.value || 0),
        intensity: parseFloat(item.find((i: any) => i.name === 'open_interest_volume')?.intensity || 0)
      },
      liquidations: {
        value: {
          long: parseFloat(item.find((i: any) => i.name === 'liquidations')?.value.long || 0),
          short: parseFloat(item.find((i: any) => i.name === 'liquidations')?.value.short || 0)
        }
      },
      ls_ratio: { value: parseFloat(item.find((i: any) => i.name === 'ls_ratio')?.value || 0) },
      markets: { value: item.find((i: any) => i.name === 'markets')?.value || '' },
      avg_yield: {
        value: {
          "1": parseFloat(item.find((i: any) => i.name === 'avg_yield')?.value["1"] || 0),
          "3": parseFloat(item.find((i: any) => i.name === 'avg_yield')?.value["3"] || 0),
          "7": parseFloat(item.find((i: any) => i.name === 'avg_yield')?.value["7"] || 0),
          "14": parseFloat(item.find((i: any) => i.name === 'avg_yield')?.value["14"] || 0),
          "30": parseFloat(item.find((i: any) => i.name === 'avg_yield')?.value["30"] || 0),
          "90": parseFloat(item.find((i: any) => i.name === 'avg_yield')?.value["90"] || 0),
          "365": parseFloat(item.find((i: any) => i.name === 'avg_yield')?.value["365"] || 0)
        }
      },
      realized_vol: {
        value: {
          "3": parseFloat(item.find((i: any) => i.name === 'realized_vol')?.value["3"] || 0),
          "7": parseFloat(item.find((i: any) => i.name === 'realized_vol')?.value["7"] || 0),
          "30": parseFloat(item.find((i: any) => i.name === 'realized_vol')?.value["30"] || 0),
          "60": parseFloat(item.find((i: any) => i.name === 'realized_vol')?.value["60"] || 0),
          "90": parseFloat(item.find((i: any) => i.name === 'realized_vol')?.value["90"] || 0),
          "180": parseFloat(item.find((i: any) => i.name === 'realized_vol')?.value["180"] || 0),
          "270": parseFloat(item.find((i: any) => i.name === 'realized_vol')?.value["270"] || 0),
          "365": parseFloat(item.find((i: any) => i.name === 'realized_vol')?.value["365"] || 0)
        }
      },
      market_cap: { value: parseFloat(item.find((i: any) => i.name === 'market_cap')?.value || 0) },
      correlation: {
        value: {
          btc: {
            "7": parseFloat(item.find((i: any) => i.name === 'correlation')?.value.btc["7"] || 0),
            "30": parseFloat(item.find((i: any) => i.name === 'correlation')?.value.btc["30"] || 0)
          },
          eth: {
            "7": parseFloat(item.find((i: any) => i.name === 'correlation')?.value.eth["7"] || 0),
            "30": parseFloat(item.find((i: any) => i.name === 'correlation')?.value.eth["30"] || 0)
          }
        }
      },
      beta: {
        value: {
          btc: {
            "7": parseFloat(item.find((i: any) => i.name === 'beta')?.value.btc["7"] || 0),
            "30": parseFloat(item.find((i: any) => i.name === 'beta')?.value.btc["30"] || 0),
            intensity_7d: parseFloat(item.find((i: any) => i.name === 'beta')?.value.btc.intensity_7d || 0),
            intensity_30d: parseFloat(item.find((i: any) => i.name === 'beta')?.value.btc.intensity_30d || 0)
          },
          eth: {
            "7": parseFloat(item.find((i: any) => i.name === 'beta')?.value.eth["7"] || 0),
            "30": parseFloat(item.find((i: any) => i.name === 'beta')?.value.eth["30"] || 0),
            intensity_7d: parseFloat(item.find((i: any) => i.name === 'beta')?.value.eth.intensity_7d || 0),
            intensity_30d: parseFloat(item.find((i: any) => i.name === 'beta')?.value.eth.intensity_30d || 0)
          }
        }
      }
    }));
  }




  //get price
  getBitcoinPrice(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'BTC-USD/spot');
  }
  getEthereumPrice(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'ETH-USD/spot');
  }


  ///chart of futures
    getFuturesDetails(ticker: string): Observable<FuturesChartData[]> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Secret': this.secret
      });

      const lowerCaseTicker = ticker.toLowerCase();

      return this.http.get<FuturesChartData[]>(`${this.apiFut}/${lowerCaseTicker}`, { headers }).pipe(
        map((data: FuturesChartData[]) => {
          console.log('Raw Data:', data); // Log raw data for debugging
          return data.map(item => ({
            date: item.date,
            p: item.p,
            oi: item.oi,
            v: item.v,
            b: item.b,
            y: item.y
          }));
        })
      );
    }


//chart of options
getOptionsDetails(ticker: string): Observable<OptionsChartData[]> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Secret': this.secret
  });

  const lowerCaseTicker = ticker.toLowerCase();

  return this.http.get<OptionsChartData[]>(`${this.apiOpt}/${lowerCaseTicker}`, { headers }).pipe(
    map((data: OptionsChartData[]) => {
      return data.map(item => ({
        date: item.date,
        up: item.up,
        oi: item.oi,
        v: item.v,
        basis: item.basis,
        atm_vol: item. atm_vol,
        d_25_rr : item.d_25_rr,
        d_25_bf:item.d_25_bf,
      }));
    })
  );
}


//chart of perpetuals
getPerpetualDetails(currency: string): Observable<PerpetualsChartData[]> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Secret': this.secret
  });

  const lowerCaseCurrency = currency.toLowerCase();

  return this.http.get<PerpetualsChartData[]>(`${this.apiPerp}/${lowerCaseCurrency}`, { headers }).pipe(
    map(data => data.map(item => ({
      date: item.date,
      price: item.price,
      open_interest: item.open_interest,
      volume: item.volume,
      funding: item.funding,
      next_fr: item.next_fr,
      yield: item.yield,
      liquidations_long: item.liquidations_long,
      liquidations_short: item.liquidations_short,
      market_cap: item.market_cap
    })))
  );
}

}
