import { Observable, of, switchMap } from "rxjs";
import {
  selectAllEntities,
  withEntities,
  getEntity,
  addEntities,
  deleteEntities,
  upsertEntities,
  upsertEntitiesById,
  selectEntity,
  updateEntities,
} from "@ngneat/elf-entities";

import { createStore } from "@ngneat/elf";
import { entitiesStateHistory } from "@ngneat/elf-state-history";
import { Product } from "./product.model";

const productStore = createStore(
  { name: "product"},
  withEntities<Product, "name">({ idKey: "name" })
);

const shapesStateHistory = entitiesStateHistory(productStore, {
  maxAge: 2,
});

shapesStateHistory.destroy();

export class ProductStoreService {
  // select All Users Data
  product$ = productStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Product[]> {
    return this.product$;
  }

  selectById(id: string): Observable<Product | undefined> {
    return productStore.pipe(selectEntity(id));
  }

  upsertproducts(products: Product[]): void {
    productStore.update(upsertEntities(products));
  }

  addproduct(product: Product): void {
    productStore.update(addEntities([product]));
  }

  updateproduct(product: Product): void {
    productStore.update(
      updateEntities(product.name, product)
    );
  }

  deleteproduct(id: string): void {
    productStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.product$.pipe(
      switchMap((item) => (item.length > 0 ? of(true) : of(false)))
    );
  }

  getById(id: string): Product | undefined {
    return productStore.query(getEntity(id));
  }

  upsertById(product: Product): void {
    productStore.update(addEntities(product));
  }

  deleteById(id: string): void {
    productStore.update(deleteEntities(id));
  }
}
