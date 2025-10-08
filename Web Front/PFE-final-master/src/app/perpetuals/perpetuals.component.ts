import { Component } from '@angular/core';
import { GlobalDataTableService } from '../services/global-data-table.service';
import { Perpetuals } from '../model/perpetuals.model';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import { PerpetualsChartData } from '../model/perpetualsChartData.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-perpetuals',
  templateUrl: './perpetuals.component.html',
  styleUrls: ['./perpetuals.component.css']
})
export class PerpetualsComponent {

  perpetuals!: Perpetuals[];
  originalData: Perpetuals[] = [];
  perpetualDetails!: PerpetualsChartData[];
  latestPerpetual: Perpetuals | null = null;
  subscription: Subscription | null = null;
  private perpetualsSubscription!: Subscription;

  messages: string[] = [];
  error: any;

  isLoading: boolean = true;
  sortedColumn: string | null = null;
  sortAscending: boolean | null = null;
  pageSize = 13;
  currentPage = 1;
  searchText: string = '';

  showFilterForm: boolean = false;
  activeFilters: any[] = [];


  constructor(private globalDataTableService: GlobalDataTableService, private webSocketService: WebSocketService, private router: Router) {}

  ngOnInit(): void {
  this.webSocketService.connect().subscribe({
      next: (frame) => {
          console.log('Connected to WebSocket:', frame);
          this.subscribeToPerpetuals();

      },
      error: (error) => console.error('WebSocket connection error:', error)
  });
}

subscribeToPerpetuals(): void {
  this.perpetualsSubscription = this.webSocketService.subscribe('/topic/perpetuals').subscribe({
      next: (data) => {
          const transformedPerpetuals = this.transformPerpetualsData(data);
          this.originalData = [...transformedPerpetuals];
          this.perpetuals = transformedPerpetuals;
          this.isLoading = false;
          this.applyFilters();
          this.applySorting();
          console.log('Transformed perpetuals:', this.perpetuals);

      },
      error: (error) => {
          console.error('Subscription error:', error);
          this.isLoading = false;

      }
  });

  }

  private transformPerpetualsData(data: any[]): Perpetuals[] {
    const transformedData: Perpetuals[] = [];

    data.forEach((perpetualArray) => {
      const findValue = (name: string) => {
        const item = perpetualArray.find((i: any) => i.name === name);
        return item ? item.value : undefined;
      };

      const findNumber = (name: string) => {
        const value = findValue(name);
        return value !== undefined ? parseFloat(value) : undefined;
      };

      const perpetual: Perpetuals = {
        currency: { value: findValue('currency') || '' },
        price: { value: findNumber('price') || 0 },
        change: { value: findNumber('change') || 0 },
        index_price: { value: findNumber('index_price') || 0 },
        open_interest: {
          value: findNumber('open_interest') || 0,
          intensity: findNumber('open_interest.intensity') || 0,
          notional: findNumber('open_interest.notional') || 0,
          change_usd_percentage: findNumber('open_interest.change_usd_percentage') || 0,
          change_usd: findNumber('open_interest.change_usd') || 0,
          change_notional: findNumber('open_interest.change_notional') || 0,
          change_notional_percentage: findNumber('open_interest.change_notional_percentage') || 0
        },
        volume: {
          value: findNumber('volume') || 0,
          intensity: findNumber('volume.intensity') || 0,
          notional: findNumber('volume.notional') || 0,
          change_usd_percentage: findNumber('volume.change_usd_percentage') || 0,
          change_usd: findNumber('volume.change_usd') || 0,
          change_notional: findNumber('volume.change_notional') || 0,
          change_notional_percentage: findNumber('volume.change_notional_percentage') || 0
        },
        funding: {
          value: findNumber('funding') || 0,
          intensity: findNumber('funding.intensity') || 0
        },
        next_fr: {
          value: findNumber('next_fr') || 0,
          intensity: findNumber('next_fr.intensity') || 0
        },
        yield: { value: findNumber('yield') || 0 },
        next_yield: { value: findNumber('next_yield') || 0 },
        open_interest_volume: {
          value: findNumber('open_interest_volume') || 0,
          intensity: findNumber('open_interest_volume.intensity') || 0
        },
        liquidations: {
          value: {
            long: findNumber('liquidations.value.long') || 0,
            short: findNumber('liquidations.value.short') || 0
          }
        },
        ls_ratio: { value: findNumber('ls_ratio') || 0 },
        markets: { value: findValue('markets') || '' },
        avg_yield: {
          value: {
            "1": findNumber('avg_yield.value.1') || 0,
            "3": findNumber('avg_yield.value.3') || 0,
            "7": findNumber('avg_yield.value.7') || 0,
            "14": findNumber('avg_yield.value.14') || 0,
            "30": findNumber('avg_yield.value.30') || 0,
            "90": findNumber('avg_yield.value.90') || 0,
            "365": findNumber('avg_yield.value.365') || 0
          }
        },
        realized_vol: {
          value: {
            "3": findNumber('realized_vol.value.3') || 0,
            "7": findNumber('realized_vol.value.7') || 0,
            "30": findNumber('realized_vol.value.30') || 0,
            "60": findNumber('realized_vol.value.60') || 0,
            "90": findNumber('realized_vol.value.90') || 0,
            "180": findNumber('realized_vol.value.180') || 0,
            "270": findNumber('realized_vol.value.270') || 0,
            "365": findNumber('realized_vol.value.365') || 0
          }
        },
        market_cap: { value: findNumber('market_cap') || 0 },
        correlation: {
          value: {
            btc: {
              "7": findNumber('correlation.value.btc.7') ?? null,
              "30": findNumber('correlation.value.btc.30') ?? null
            },
            eth: {
              "7": findNumber('correlation.value.eth.7') ?? null,
              "30": findNumber('correlation.value.eth.30') ?? null
            }
          }
        },
        beta: {
          value: {
            btc: {
              "7": findNumber('beta.value.btc.7') ?? null,
              "30": findNumber('beta.value.btc.30') ?? null,
              intensity_7d: findNumber('beta.value.btc.intensity_7d'),
              intensity_30d: findNumber('beta.value.btc.intensity_30d')
            },
            eth: {
              "7": findNumber('beta.value.eth.7') ?? null,
              "30": findNumber('beta.value.eth.30') ?? null,
              intensity_7d: findNumber('beta.value.eth.intensity_7d'),
              intensity_30d: findNumber('beta.value.eth.intensity_30d')
            }
          }
        }
      };
      transformedData.push(perpetual);
    });

    return transformedData;
  }




ngOnDestroy() {
  if (this.perpetualsSubscription) {
    this.perpetualsSubscription.unsubscribe();
  }
  this.webSocketService.disconnect();
}

getPerpetuals() {
  this.globalDataTableService.getPerpetuals().subscribe(data => {
    this.perpetuals = data;
    this.originalData = [...this.perpetuals];
  });
}

 pageChanged(event: any) {
    this.currentPage = event;
  }



 /**les 3 cards*/
 getTotalVolume(): number {
  if (!this.originalData) return 0;
  return this.originalData.reduce((total, perpetuals) => total + perpetuals.volume.value, 0);
}

getTotalOpenInterest(): number {
  if (!this.originalData) return 0;
  return this.originalData.reduce((total, perpetuals) => total + perpetuals.open_interest.value,0);
}

getHighestVolumeTicker(): { ticker: string, volume: number } {
  if (!this.originalData || this.originalData.length === 0) return { ticker: '-', volume: 0 };
  const highestVolumePerpetual= this.originalData.reduce((max, perpetual) => perpetual.volume.value > max.volume.value ? perpetual : max, this.originalData[0]);
  return { ticker: highestVolumePerpetual.currency.value, volume: highestVolumePerpetual.volume.value };
}

getHighestOpenInterestTicker(): { ticker: string, openInterest: number } {
  if (!this.originalData || this.originalData.length === 0) return { ticker: '-', openInterest: 0 };
  const highestOpenInterestPerpetual= this.originalData.reduce((max, perpetual) => perpetual.open_interest.value > max.open_interest.value ? perpetual : max, this.originalData[0]);
  return { ticker: highestOpenInterestPerpetual.currency.value, openInterest: highestOpenInterestPerpetual.open_interest.value };
}


/***Sort */
sortTable(column: string): void {
  if (this.sortedColumn === column) {
    if (this.sortAscending === null) {

      this.sortAscending = true;
      this.perpetuals.sort((a, b) => this.compareValues(a, b, column));
    } else if (this.sortAscending) {

      this.sortAscending = false;
      this.perpetuals.sort((a, b) => this.compareValues(a, b, column)).reverse();
    } else {

      this.perpetuals = [...this.originalData];
      this.sortedColumn = null;
      this.sortAscending = null;
    }
  } else {

    this.sortedColumn = column;
    this.sortAscending = true;
    this.perpetuals.sort((a, b) => this.compareValues(a, b, column));
  }
  this.applySorting();
}

applySorting(): void {
  if (this.sortedColumn) {
    this.perpetuals.sort((a, b) => this.compareValues(a, b, this.sortedColumn!));
    if (!this.sortAscending) {
      this.perpetuals.reverse();
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
  return properties.reduce((prev: any, curr: string) => {
    if (prev && typeof prev === 'object' && curr in prev) {
      return prev[curr];
    } else {
      return undefined;
    }
  }, obj);
}


getSortingIndicator(column: string): string {
  if (this.sortedColumn === column) {
    return this.sortAscending ? '↑' : '↓';
  } else {
    return '';
  }
}



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
        this.perpetuals = [...this.originalData];
      } else {
        this.perpetuals = this.originalData.filter((perpetual) => {
          return filters.every((filter) => {
            const column = filter.column;
            const operator = filter.operator;
            const value = filter.value;

            if (!column) {
              console.error('Column is undefined or null. Filter:', filter);
              return false;
            }

            const columnValue = this.getPropertyValue(perpetual, column);

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

      console.log('Filtered Data:', this.perpetuals);
      this.currentPage = 1;
      this.applySorting();
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  }


  toggleFilterForm() {
    this.showFilterForm = !this.showFilterForm;
    if (!this.showFilterForm) {
      this.perpetuals = [...this.originalData];
      this.applySorting();
    }
  }

  onFilterRemoved(filters: any[]) {
    if (filters.length === 0) {
      this.perpetuals = [...this.originalData];
    } else {
      this.applyAdvancedFilter(filters);
    }
    this.applySorting();
  }


  /****Fin filter*/

  /****Search by ticker */
  filterByTicker(): void {
    if (!this.searchText) {
      this.perpetuals = [...this.originalData];
    } else {
      this.perpetuals = this.originalData.filter(perpt =>
        perpt.currency.value.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }



/***navigate to line charts*/
navigateToDetail(ticker: string): void {
  this.router.navigate(['/currency', ticker]);
}
}
