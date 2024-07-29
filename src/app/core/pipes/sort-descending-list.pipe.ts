import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'sortDescending'
})
export class SortDescendingPipe implements PipeTransform {
  constructor() { }
  
  transform(array: any[], order?: string, sortBy?: string): any[] {
    const sortOrder = order ? order : 'asc'; // Set default ascending order
    return sortOrder === 'asc' ? array.sort((a, b) => a.id - b.id) : array.sort((a, b) => b.id - a.id);
  }
}
