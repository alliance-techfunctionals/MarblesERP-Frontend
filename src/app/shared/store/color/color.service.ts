import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { ColorStoreService } from './color.store';
import { Color } from './color.model';
import { CarpetInventoryHttpService } from '../../service/carpet-inventory.http.service';

@Injectable({ providedIn: 'root' })
export class ColorService {

  constructor(
    protected store: ColorStoreService,
    private CarpetInventoryService: CarpetInventoryHttpService
  ) { }

  // get All Color list
  getAll(): Observable<Color[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllColor().pipe(
          catchError(result => {
            return EMPTY;
          }),
          tap((records: Color[]) => {
            this.store.upsertColors(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

}
