import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Perpetuals } from '../model/perpetuals.model';


@Component({
  selector: 'app-perpetuals-filter',
  templateUrl: './perpetuals-filter.component.html',
  styleUrls: ['./perpetuals-filter.component.css']
})
export class PerpetualsFilterComponent {

  @Input() perpetuals: Perpetuals[] = [];
  @Output() filterApplied = new EventEmitter<any>();


  selectedColumn: string = '';
  selectedOperator: string = '';
  filterValue: string = '';

  columnFilters: any = {};
  savedFilters: any[] = [];

  filters: any[] = [];
  ButtonDisabled = true;

  columnOptions = [
    { key: 'currency.value', displayName: 'Ticker' },
    { key: 'market_cap', displayName: 'Market Cap' },
    { key: 'price.value', displayName: 'Price' },
    { key: 'change.value', displayName: 'Change' },
    { key: 'funding.value', displayName: 'Funding' },
    { key: 'yield.value', displayName: 'APR' },
    { key: 'next_fr.value', displayName: 'Next Funding' },
    { key: 'volume.value', displayName: '24h Volume' },
    { key: 'open_interest.value', displayName: 'Open Interest' },
    { key: 'index_price.value', displayName: 'OI Change' },
    { key: 'open_interest_volume.value', displayName: 'OI/24h Volume' },



  ];

  operators: any = {
    'currency.value': ['Contains', 'Does not contain', 'Starts with', 'Ends with', 'Is', 'Is not'],
    'market_cap': ['=', '!=', '<', '>', '<=', '>='],
    'price.value': ['=', '!=', '<', '>', '<=', '>='],
    'change.value': ['=', '!=', '<', '>', '<=', '>='],
    'funding.value': ['=', '!=', '<', '>', '<=', '>='],
    'yield.value': ['=', '!=', '<', '>', '<=', '>='],
    'next_fr.value': ['=', '!=', '<', '>', '<=', '>='],
    'volume.value': ['=', '!=', '<', '>', '<=', '>='],
    'open_interest.value': ['=', '!=', '<', '>', '<=', '>='],
    'index_price.value': ['=', '!=', '<', '>', '<=', '>='],
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
