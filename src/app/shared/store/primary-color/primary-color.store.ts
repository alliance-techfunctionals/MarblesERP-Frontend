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
import { PrimaryColor } from "./primary-color.model";

const colorStore = createStore(
  { name: "color" },
  withEntities<PrimaryColor, "name">({ idKey: "name" })
);

const colorsStateHistory = entitiesStateHistory(colorStore, {
  maxAge: 2,
});

colorsStateHistory.destroy();

export class PrimaryColorStoreService {
  // select All Users Data
  colors$ = colorStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<PrimaryColor[]> {
    return this.colors$;
  }

  selectById(id: string): Observable<PrimaryColor | undefined> {
    return colorStore.pipe(selectEntity(id));
  }

  upsertColors(colors: PrimaryColor[]): void {
    colorStore.update(upsertEntities(colors));
  }

  addColor(color: PrimaryColor): void {
    colorStore.update(addEntities([color]));
  }

  updateColor(color: PrimaryColor): void {
    colorStore.update(
      updateEntities(color.name, color)
    );
  }

  deleteColor(id: string): void {
    colorStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.colors$.pipe(
      switchMap((item) => (item.length > 0 ? of(true) : of(false)))
    );
  }

  getById(id: string): PrimaryColor | undefined {
    return colorStore.query(getEntity(id));
  }

  upsertById(color: PrimaryColor): void {
    colorStore.update(addEntities(color));
  }

  deleteById(id: string): void {
    colorStore.update(deleteEntities(id));
  }
}
