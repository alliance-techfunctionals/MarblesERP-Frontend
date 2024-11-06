import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { ShapeStoreService } from './shape.store';
import { Shape } from './shape.model';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';

@Injectable({ providedIn: 'root' })
export class ShapeService {

  constructor(
    protected store: ShapeStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService
  ) { }

  // get All Shapes list
  getAll(): Observable<Shape[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllShape().pipe(
          catchError(result => {
            return EMPTY;
          }),
          tap((records: Shape[]) => {
            this.store.upsertShapes(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

}
