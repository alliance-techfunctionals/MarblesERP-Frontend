import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { PrimaryColorStoreService } from './primary-color.store';
import { PrimaryColor } from './primary-color.model';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';

@Injectable({ providedIn: 'root' })
export class PrimaryColorService {

  constructor(
    protected store: PrimaryColorStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService
  ) { }

  // get All Color list
  getAll(): Observable<PrimaryColor[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllPrimaryColor().pipe(
          catchError(result => {
            return EMPTY;
          }),
          tap((records: PrimaryColor[]) => {
            this.store.upsertColors(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

}
