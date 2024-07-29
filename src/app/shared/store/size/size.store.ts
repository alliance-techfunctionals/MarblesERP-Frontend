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
import { Size } from "./size.model";

const sizeStore = createStore(
  { name: "size" },
  withEntities<Size, "name">({ idKey: "name" })
);

const sizesStateHistory = entitiesStateHistory(sizeStore, {
  maxAge: 2,
});

sizesStateHistory.destroy();

export class SizeStoreService {
  // select All Users Data
  sizes$ = sizeStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Size[]> {
    return this.sizes$;
  }

  selectById(id: string): Observable<Size | undefined> {
    return sizeStore.pipe(selectEntity(id));
  }

  upsertSizes(sizes: Size[]): void {
    sizeStore.update(upsertEntities(sizes));
  }

  addsize(size: Size): void {
    sizeStore.update(addEntities([size]));
  }

  updatesize(size: Size): void {
    sizeStore.update(
      updateEntities(size.name, size)
    );
  }

  deletesize(id: string): void {
    sizeStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.sizes$.pipe(
      switchMap((item) => (item.length > 0 ? of(true) : of(false)))
    );
  }

  getById(id: string): Size | undefined {
    return sizeStore.query(getEntity(id));
  }

  upsertById(size: Size): void {
    sizeStore.update(addEntities(size));
  }

  deleteById(id: string): void {
    sizeStore.update(deleteEntities(id));
  }
}
