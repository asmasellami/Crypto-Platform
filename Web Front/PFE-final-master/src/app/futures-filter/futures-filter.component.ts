import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Futures } from '../model/futures.model';

@Component({
  selector: 'app-futures-filter',
  templateUrl: './futures-filter.component.html',
  styleUrls: ['./futures-filter.component.css']
})
export class FuturesFilterComponent {
  @Input() futures: Futures[] = [];
  @Output() filterApplied = new EventEmitter<any>();


  selectedColumn: string = '';
  selectedOperator: string = '';
  filterValue: string = '';

  columnFilters: any = {};
  savedFilters: any[] = [];

  filters: any[] = [];

  ButtonDisabled = true;

  columnOptions = [
    { key: 'ticker.value', displayName: 'Ticker' },
    { key: 'price.value', displayName: 'Price' },
    { key: 'change.value', displayName: 'Chg%(Price)' },
    { key: 'basis.value', displayName: 'Basis' },
    { key: 'yield.value', displayName: 'APR' },
    { key: 'volume.value', displayName: '24h Volume' },
    { key: 'volume.change_usd_percentage', displayName: 'chg%(24hVolume)' },
    { key: 'open_interest.value', displayName: 'Open Interest' },
    { key: 'open_interest.change_usd', displayName: 'OI Change' },
    { key: 'change_usd_percentage', displayName: 'Chg%(OI Change)' },
    { key: 'open_interest_volume.value', displayName: 'OI/24h Volume' },

  ];

  operators: any = {
    'ticker.value': ['Contains', 'Does not contain', 'Starts with', 'Ends with'],
    'price.value': ['=', '!=', '<', '>', '<=', '>='],
    'change.value': ['=', '!=', '<', '>', '<=', '>='],
    'basis.value': ['=', '!=', '<', '>', '<=', '>='],
    'yield.value': ['=', '!=', '<', '>', '<=', '>='],
    'volume.value': ['=', '!=', '<', '>', '<=', '>='],
    'volume.change_usd_percentage': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest.value': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest.change_usd': ['=', '!=', '<', '>', '<=', '>='],
    'change_usd_percentage': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest_volume.value': ['=', '!=', '<', '>', '<=', '>='],

  };

  applyFilter() {
    if (this.filters.length > 0) {
      console.log('Applying filters:', this.filters);
      this.filterApplied.emit(this.filters);
    } else {
      console.warn('No filters to apply.');
    }
  }


    addFilter() {
      const newFilter = {
        column: this.selectedColumn,
        operator: this.selectedOperator,
        value: this.filterValue
      };

      this.filters.push(newFilter);
      this.ButtonDisabled = false;
      console.log('Added filter:', newFilter);
      console.log('All filters:', this.filters);

      this.selectedColumn = '';
      this.selectedOperator = '';
      this.filterValue = '';
    }

removeFilter(index: number) {
  this.filters.splice(index, 1);
  console.log('Removed filter at index', index);
  console.log('Remaining filters:', this.filters);
  this.filterApplied.emit(this.filters);
}

getColumnDisplayName(columnKey: string): string {
  const column = this.columnOptions.find(option => option.key === columnKey);
  return column ? column.displayName : columnKey;
}
}
