import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { SizeStoreService } from './size.store';
import { Size } from './size.model';
import { CarpetInventoryHttpService } from '../../service/carpet-inventory.http.service';

@Injectable({ providedIn: 'root' })
export class SizeService {

  constructor(
    protected store: SizeStoreService,
    private CarpetInventoryService: CarpetInventoryHttpService
  ) { }

  // get All Size list
  getAll(): Observable<Size[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllSize().pipe(
          catchError(result => {
            return EMPTY;
          }),
          tap((records: Size[]) => {
            this.store.upsertSizes(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

}
