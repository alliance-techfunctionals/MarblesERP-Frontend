import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { ProductStoreService } from './product.store';
import { Product } from './product.model';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';

@Injectable({ providedIn: 'root' })
export class ProductService {

  constructor(
    protected store: ProductStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService
  ) { }

  // get All Products list
  getAll(): Observable<Product[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllProduct().pipe(
          catchError(result => {
            return EMPTY;
          }),
          tap((records: Product[]) => {
            this.store.upsertproducts(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

}
