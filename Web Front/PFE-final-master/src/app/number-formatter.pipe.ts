import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormatter'
})
  export class NumberFormatterPipe implements PipeTransform {
    transform(value: number | null): string {
      if (value === null) {
        return '-';
      } else if (value >= 1e12 || value <= -1e12) {
        return this.formatWithSuffix(value, 1e12, 'T');
      } else if (value >= 1e9 || value <= -1e9) {
        return this.formatWithSuffix(value, 1e9, 'B');
      } else if (value >= 1e6 || value <= -1e6) {
        return this.formatWithSuffix(value, 1e6, 'M');
      } else if (value >= 1e3 || value <= -1e3) {
        return this.formatWithSuffix(value, 1e3, 'K');
      } else {
        return value.toFixed(2);
      }
    }

    private formatWithSuffix(value: number, divisor: number, suffix: string): string {
      const formattedValue = (Math.abs(value) / divisor).toFixed(2);
      const prefix = value < 0 ? '-' : '';
      return `${prefix}${formattedValue}${suffix}`;
    }
  }


