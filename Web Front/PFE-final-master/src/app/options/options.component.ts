import { Component } from '@angular/core';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { Options } from '../model/options.model';
import { Subscription } from 'rxjs';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import 'chartjs-plugin-datalabels';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { WebSocketService } from '../services/websocket.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})

export class OptionsComponent {
  options!: Options[];
  pageSize = 13;
  currentPage = 1;
  sortedColumn: string | null = null;
  sortAscending: boolean | null = null;
  originalData: Options[] = [];
  mode: 'USD' | 'Notional' = 'USD';
  activeFilters: any[] = [];
  showFilterForm: boolean = false;
  private updateSubscription!: Subscription;

  isLoading: boolean = true;

  searchText: string = '';

  /***Les Chartes*/
  volumeDataByCurrency: { currency: string, totalVolume: number }[] = [];
  volumeDistributionChart!: Chart<"pie", number[], string>;

  openInterestDataByCurrency: { currency: string, totalOI: number }[] = [];
  openInterestDistributionChart!: Chart<"pie", number[], string>;

  volumeByExpiryChart!: Chart;
  private optionsSubscription!: Subscription;


  constructor(private globalDataTableService: GlobalDataTableService, private webSocketService: WebSocketService,private authService:AuthService, private router: Router) { }
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
  this.optionsSubscription = this.webSocketService.subscribe('/topic/options').subscribe({
      next: (data) => {
          const transformedOptions = this.transformOptions(data);
          this.originalData = [...transformedOptions];
          this.options = transformedOptions;
          this.isLoading = false;
          this.applyFilters();
          this.applySorting();
          console.log('Transformed futures:', this.options);
      },
      error: (error) => {
          console.error('Subscription error:', error);
          this.isLoading = false;

      }
  });


   //Chart 1 des Global Options Volume Distribution
   this.globalDataTableService.getOptions().subscribe(options => {
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
  this.globalDataTableService.getOptions().subscribe(options => {
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



  getOptions() {
    this.globalDataTableService.getOptions().subscribe(data => {
      this.options = data;
      this.originalData = [...this.options];
    });
  }

  ngOnDestroy() {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    if (this.volumeDistributionChart) {
      this.volumeDistributionChart.destroy();
    }

     this.optionsSubscription?.unsubscribe();
     this.webSocketService.disconnect();

  }

  pageChanged(event: any) {
    this.currentPage = event;
  }


  /**les 3cards*/
  getTotalVolume(): number {
    if (!this.originalData) return 0;
    return this.originalData.reduce((total, option) => total + option.volume.value, 0);
  }

  getTotalOpenInterest(): number {
    if (!this.originalData) return 0;
    return this.originalData.reduce((total, option) => total + option.open_interest.value, 0);
  }

  getHighestVolumeTicker(): { ticker: string, volume: number } {
    if (!this.originalData || this.originalData.length === 0) return { ticker: '-', volume: 0 };
    const highestVolumeOption = this.originalData.reduce((max, option) => option.volume.value > max.volume.value ? option : max, this.originalData[0]);
    return { ticker: highestVolumeOption.ticker.value, volume: highestVolumeOption.volume.value };
  }

  getHighestOpenInterestTicker(): { ticker: string, openInterest: number } {
    if (!this.originalData || this.originalData.length === 0) return { ticker: '-', openInterest: 0 };
    const highestOpenInterestOption = this.originalData.reduce((max, option) => option.open_interest.value > max.open_interest.value ? option : max, this.originalData[0]);
    return { ticker: highestOpenInterestOption.ticker.value, openInterest: highestOpenInterestOption.open_interest.value };
  }

  /****Sort */
    sortTable(column: string): void {
    if (this.sortedColumn === column) {
      if (this.sortAscending === null) {

        this.sortAscending = true;
        this.options.sort((a, b) => this.compareValues(a, b, column));
      } else if (this.sortAscending) {

        this.sortAscending = false;
        this.options.sort((a, b) => this.compareValues(a, b, column)).reverse();
      } else {

        this.options = [...this.originalData];
        this.sortedColumn = null;
        this.sortAscending = null;
      }
    } else {

      this.sortedColumn = column;
      this.sortAscending = true;
      this.options.sort((a, b) => this.compareValues(a, b, column));
    }
    this.applySorting();
  }

  applySorting(): void {
    if (this.sortedColumn) {
      this.options.sort((a, b) => this.compareValues(a, b, this.sortedColumn!));
      if (!this.sortAscending) {
        this.options.reverse();
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


  /***Mode** */
  switchMode(mode: 'USD' | 'Notional') {
    this.mode = mode;

  }



/***columns color*/
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
        this.options = [...this.originalData];
      } else {
        this.options = this.originalData.filter((future) => {
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

      console.log('Filtered Data:', this.options);
      this.currentPage = 1;
      this.applySorting();
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }


  toggleFilterForm() {
    this.showFilterForm = !this.showFilterForm;
    if (!this.showFilterForm) {
      this.options = [...this.originalData];
      this.applySorting();
    }
  }

  onFilterRemoved(filters: any[]) {
    if (filters.length === 0) {
      this.options = [...this.originalData];
    } else {
      this.applyAdvancedFilter(filters);
    }
    this.applySorting();
  }


 /****Fin filter*/


 /****Search by ticker */
 filterByTicker(): void {
  if (!this.searchText) {
    this.options = [...this.originalData];
  } else {
    this.options = this.originalData.filter(option =>
      option.ticker.value.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  this.applySorting();
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


/***navigate to line charts*/
navigateToDetail(ticker: string): void {
  this.router.navigate(['/tickerOpt', ticker]);
}
}
