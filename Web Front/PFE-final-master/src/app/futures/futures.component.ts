import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { Futures } from '../model/futures.model';
import {Subscription} from 'rxjs';
import 'chartjs-adapter-moment';
import { WebSocketService } from '../services/websocket.service';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-futures',
  templateUrl: './futures.component.html',
  styleUrls: ['./futures.component.css'],
})
export class FuturesComponent implements OnInit, OnDestroy {
  pageSize = 13;
  currentPage = 1;
  futures!: Futures[];
  originalData: Futures[] = [];

  sortedColumn: string | null = null;
  sortAscending: boolean | null = null;


  mode: 'USD' | 'Notional' = 'USD';

  showFilterForm: boolean = false;

  latestFuture: Futures | null = null;
  subscription: Subscription | null = null;
  private futuresSubscription!: Subscription;
  messages: string[] = [];

  error: any;
  activeFilters: any[] = [];

  searchText: string = '';

  isLoading: boolean = true;

  /***Les Chartes*/
  volumeDataByCurrency: { currency: string, totalVolume: number }[] = [];
  volumeDistributionChart!: Chart<"pie", number[], string>;
  openInterestDataByCurrency: { currency: string, totalOI: number }[] = [];
  openInterestDistributionChart!: Chart<"pie", number[], string>;




constructor(private globalDataTableService: GlobalDataTableService, private webSocketService: WebSocketService, private router: Router) {}

ngOnInit(): void {
  this.webSocketService.connect().subscribe({
      next: (frame) => {
          console.log('Connected to WebSocket:', frame);
          this.subscribeToOptions();
      },
      error: (error) => console.error('WebSocket connection error:', error)
  });
}

subscribeToOptions(): void {
  this.futuresSubscription = this.webSocketService.subscribe('/topic/futures').subscribe({
      next: (data) => {
          const transformedFutures = this.transformFuturesData(data);
          this.originalData = [...transformedFutures];
          this.futures = transformedFutures;

          this.isLoading = false;

          this.applyFilters();
          this.applySorting();
          console.log('Transformed futures:', this.futures);
      },
      error: (error) => {
          console.error('Subscription error:', error);
          this.isLoading = false;

      }
  });
  //Chart 1 des Global Options Volume Distribution
  this.globalDataTableService.getFutures().subscribe(options => {
    const volumeByCurrencyMap = new Map<string, number>();
    options.forEach(option => {
      const currency = option.currency.value;
      const volume = option.volume.value;
      if (volumeByCurrencyMap.has(currency)) {
        volumeByCurrencyMap.set(currency, volumeByCurrencyMap.get(currency)! + volume);
      } else {
        volumeByCurrencyMap.set(currency, volume );
      }
    });
    this.volumeDataByCurrency = Array.from(volumeByCurrencyMap.entries()).map(([currency, totalVolume]) => ({ currency, totalVolume }));
    this.updateVolumeDistributionChart();
  });
  //Chart 2 des OI
  this.globalDataTableService.getFutures().subscribe(options => {
    const oiByCurrencyMap = new Map<string, number>();
    options.forEach(option => {
      const currency = option.currency.value;
      const oi = option.open_interest.value;
      if (oiByCurrencyMap.has(currency)) {
        oiByCurrencyMap.set(currency, oiByCurrencyMap.get(currency)! + oi);
      } else {
        oiByCurrencyMap.set(currency, oi);
      }
    });
    this.openInterestDataByCurrency = Array.from(oiByCurrencyMap.entries()).map(([currency, totalOI]) => ({ currency, totalOI }));
    this.updateOpenInterestDistributionChart();
  });



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

ngOnDestroy() {
  if (this.futuresSubscription) {
    this.futuresSubscription.unsubscribe();
  }
  this.webSocketService.disconnect();
}

getFutures() {
  this.globalDataTableService.getFutures().subscribe(data => {
    this.futures = data;
    this.originalData = [...this.futures];
  });
}

  /******* */

  pageChanged(event: any) {
    this.currentPage = event;
  }

  /**les 3 cards*/
  getTotalVolume(): number {
    if (!this.originalData) return 0;
    return this.originalData.reduce((total, future) => total + future.volume.value, 0);
  }

  getTotalOpenInterest(): number {
    if (!this.originalData) return 0;
    return this.originalData.reduce((total, future) => total + future.open_interest.value, 0);
  }

  getHighestVolumeTicker(): { ticker: string, volume: number } {
    if (!this.originalData || this.originalData.length === 0) return { ticker: '-', volume: 0 };
    const highestVolumeFuture = this.originalData.reduce((max, future) => future.volume.value > max.volume.value ? future : max, this.originalData[0]);
    return { ticker: highestVolumeFuture.ticker.value, volume: highestVolumeFuture.volume.value };
  }

  getHighestOpenInterestTicker(): { ticker: string, openInterest: number } {
    if (!this.originalData || this.originalData.length === 0) return { ticker: '-', openInterest: 0 };
    const highestOpenInterestFuture = this.originalData.reduce((max, future) => future.open_interest.value > max.open_interest.value ? future : max, this.originalData[0]);
    return { ticker: highestOpenInterestFuture.ticker.value, openInterest: highestOpenInterestFuture.open_interest.value };
  }
/********fin 3 card**** */

  /*****DEBUT SORT TABLE******/
  sortTable(column: string): void {
    if (this.sortedColumn === column) {
      if (this.sortAscending === null) {

        this.sortAscending = true;
        this.futures.sort((a, b) => this.compareValues(a, b, column));
      } else if (this.sortAscending) {

        this.sortAscending = false;
        this.futures.sort((a, b) => this.compareValues(a, b, column)).reverse();
      } else {

        this.futures = [...this.originalData];
        this.sortedColumn = null;
        this.sortAscending = null;
      }
    } else {

      this.sortedColumn = column;
      this.sortAscending = true;
      this.futures.sort((a, b) => this.compareValues(a, b, column));
    }
    this.applySorting();
  }

  applySorting(): void {
    if (this.sortedColumn) {
      this.futures.sort((a, b) => this.compareValues(a, b, this.sortedColumn!));
      if (!this.sortAscending) {
        this.futures.reverse();
      }
    }
  }


  compareValues(a: any, b: any, column: string): number {
    const valueA = this.getPropertyValue(a, column);
    const valueB = this.getPropertyValue(b, column);

    if (valueA > valueB) {
      return 1;
    } else if (valueA < valueB) {
      return -1;
    } else {
      return 0;
    }
  }

  private getPropertyValue(obj: any, path: string): any {
    const properties = path.split('.');
    return properties.reduce((prev: any, curr: string) => prev[curr], obj);
  }

  getSortingIndicator(column: string): string {
    if (this.sortedColumn === column) {
      return this.sortAscending ? '↑' : '↓';
    } else {
      return '';
    }
  }
  /*********FIN SORT  */




  /****MODE USD/NOTIONAL */
  switchMode(mode: 'USD' | 'Notional') {
    this.mode = mode;
  }
  /**** FIN MODE USD/NOTIONAL */


  /***colors */
  getGradientColor(intensity: number): string {
    if (intensity >= 0) {
      const green = '81, 204, 139';
      const color = intensity;
      return `rgba(${green}, ${color})`;
    } else {
      const red = '251, 113, 113';
      const color = Math.abs(intensity);
      return `rgba(${red}, ${color})`;
    }
  }
  /***fin colors */


  /****filter****/
   applyFilters(): void {
    if (this.activeFilters.length > 0) {
      this.applyAdvancedFilter(this.activeFilters);
    }
  }
  applyAdvancedFilter(filters: any[]) {
    this.activeFilters = filters;
    try {
      console.log('Filters:', filters);

      if (filters.length === 0) {
        this.futures = [...this.originalData];
      } else {
        this.futures = this.originalData.filter((future) => {
          return filters.every((filter) => {
            const column = filter.column;
            const operator = filter.operator;
            const value = filter.value;

            if (!column) {
              console.error('Column is undefined or null. Filter:', filter);
              return false;
            }

            const columnValue = this.getPropertyValue(future, column);

            console.log('Column:', column, 'Value:', columnValue);

            if (columnValue !== undefined && columnValue !== null) {
              switch (operator) {
                case 'Contains':
                  return columnValue
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
                case 'Does not contain':
                  return !columnValue
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase());
                case 'Is':
                  return (
                    columnValue.toString().toLowerCase() === value.toLowerCase()
                  );
                case 'Is not':
                  return (
                    columnValue.toString().toLowerCase() !== value.toLowerCase()
                  );
                case 'Starts with':
                  return columnValue
                    .toString()
                    .toLowerCase()
                    .startsWith(value.toLowerCase());
                case 'Ends with':
                  return columnValue
                    .toString()
                    .toLowerCase()
                    .endsWith(value.toLowerCase());
                case '=':
                  return columnValue == value;
                case '!=':
                  return columnValue != value;
                case '<':
                  return columnValue < value;
                case '>':
                  return columnValue > value;
                case '<=':
                  return columnValue <= value;
                case '>=':
                  return columnValue >= value;
                default:
                  return true;
              }
            } else {
              return false;
            }
          });
        });
      }

      console.log('Filtered Data:', this.futures);
      this.currentPage = 1;
      this.applySorting();
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }


  toggleFilterForm() {
    this.showFilterForm = !this.showFilterForm;
    if (!this.showFilterForm) {
      this.futures = [...this.originalData];
      this.applySorting();
    }
  }

  onFilterRemoved(filters: any[]) {
    if (filters.length === 0) {
      this.futures = [...this.originalData];
    } else {
      this.applyAdvancedFilter(filters);
    }
    this.applySorting();
  }


  /****Search by ticker****/
  filterByTicker(): void {
    if (!this.searchText) {
      this.futures = [...this.originalData];
    } else {
      this.futures = this.originalData.filter(future =>
        future.ticker.value.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }




  /*******Chart 1 VOLUME */
 initVolumeDistributionChart() {
  const ctx = document.getElementById('volumeDistributionChart') as HTMLCanvasElement;
  this.volumeDistributionChart = new Chart<"pie", number[], string>(ctx, {
    type: 'pie',
    data: {
      labels: this.volumeDataByCurrency.map(data => data.currency),
      datasets: [{
        label: 'Volume Distribution',
        data: this.volumeDataByCurrency.map(data => data.totalVolume),
        backgroundColor: [
          'rgb(244, 88, 65)',
          'rgb(79, 228, 110)',
          'rgba(255, 206, 86)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(255, 159, 64)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color:'white',
            usePointStyle: true
          }
        }
      },
      layout: {
        padding: {
          bottom: 20
        }
      }
    }
  });
}
updateVolumeDistributionChart() {
  if (this.volumeDistributionChart) {
    this.volumeDistributionChart.data.labels = this.volumeDataByCurrency.map(data => data.currency);
    this.volumeDistributionChart.data.datasets[0].data = this.volumeDataByCurrency.map(data => data.totalVolume);
    this.volumeDistributionChart.update();
  } else {
    this.initVolumeDistributionChart();
  }
}

/*****CHART 2 OI */
initOpenInterestDistributionChart() {
  const ctx = document.getElementById('openInterestDistributionChart') as HTMLCanvasElement;
  this.openInterestDistributionChart = new Chart<"pie", number[], string>(ctx, {
    type: 'pie',
    data: {
      labels: this.openInterestDataByCurrency.map(data => data.currency),
      datasets: [{
        label: 'Open Interest Distribution',
        data: this.openInterestDataByCurrency.map(data => data.totalOI),
        backgroundColor: [
          'rgb(244, 88, 65)',
          'rgb(79, 228, 110)',
          'rgba(255, 206, 86)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(255, 159, 64)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color:'white'
          }
        }
      },
      layout: {
        padding: {
          bottom: 20

        }
      }
    }
  });
}

updateOpenInterestDistributionChart() {
  if (this.openInterestDistributionChart) {
    this.openInterestDistributionChart.data.labels = this.openInterestDataByCurrency.map(data => data.currency);
    this.openInterestDistributionChart.data.datasets[0].data = this.openInterestDataByCurrency.map(data => data.totalOI);
    this.openInterestDistributionChart.update();
  } else {
    this.initOpenInterestDistributionChart();
  }
}



navigateToDetail(ticker: string): void {
  this.router.navigate(['/ticker', ticker]);
}



}
