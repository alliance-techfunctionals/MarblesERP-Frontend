import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TypeaheadService {

  constructor(
  ){}

  search = (text$: Observable<string>, items: string[]) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			map((term) =>
				term.length < 2 ? [] : items.filter((v) => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10),
			),
		);
  
}