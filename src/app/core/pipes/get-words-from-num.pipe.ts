import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class GetNumberToWordsPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    if (isNaN(value)) return '';
    if (value === 0) return 'zero';

    const units = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
                   'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    if (value < 20) {
      return units[value];
    } else if (value < 100) {
      return tens[Math.floor(value / 10)] + (value % 10 !== 0 ? ' ' + units[value % 10] : '');
    } else if (value < 1000) {
      return units[Math.floor(value / 100)] + ' hundred' + (value % 100 !== 0 ? ' and ' + this.transform(value % 100) : '');
    }
    // Extend logic here for thousands, millions, etc. if needed
    return value.toString(); // Fallback for numbers larger than handled
  }
}