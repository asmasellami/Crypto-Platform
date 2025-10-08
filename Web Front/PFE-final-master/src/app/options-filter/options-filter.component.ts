import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Options } from '../model/options.model';

@Component({
  selector: 'app-options-filter',
  templateUrl: './options-filter.component.html',
  styleUrls: ['./options-filter.component.css']
})
export class OptionsFilterComponent {
  @Input() options: Options[] = [];
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
    { key: 'underlying_price.value', displayName: 'Underlying price' },
    { key: 'change.value', displayName: 'Chg%(Price)' },
    { key: 'basis.value', displayName: 'Basis' },
    { key: 'atm_vol.value', displayName: 'ATM Vol' },
    { key: '_25_delta_risk_reversal.value', displayName: '25Δ RR' },
    { key: '_25_delta_butterfly.value', displayName: '25Δ BF' },
    { key: 'volume.value', displayName: '24h Volume' },
    { key: 'volume.change_usd_percentage', displayName: 'Chg%(24h Volume)' },
    { key: 'open_interest.value', displayName: 'Total OI' },
    { key: 'open_interest.change_usd', displayName: 'OI Change' },
    { key: 'open_interest.change_usd_percentage', displayName: 'Chg%(OI Change)' }
  ];

  operators: any = {
    'ticker.value': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is empty', 'Is not empty'],
    'underlying_price.value': ['=', '!=', '<', '>', '<=', '>='],
    'change.value': ['=', '!=', '<', '>', '<=', '>='],
    'basis.value': ['=', '!=', '<', '>', '<=', '>='],
    'atm_vol.value': ['=', '!=', '<', '>', '<=', '>='],
    '_25_delta_risk_reversal.value': ['=', '!=', '<', '>', '<=', '>='],
    '_25_delta_butterfly.value': ['=', '!=', '<', '>', '<=', '>='],
    'volume.value': ['=', '!=', '<', '>', '<=', '>='],
    'volume.change_usd_percentage': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest.value': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest.change_usd': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest.change_usd_percentage': ['=', '!=', '<', '>', '<=', '>=']
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
