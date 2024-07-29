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
import { Color } from "./color.model";

const colorStore = createStore(
  { name: "color" },
  withEntities<Color, "name">({ idKey: "name" })
);

const colorsStateHistory = entitiesStateHistory(colorStore, {
  maxAge: 2,
});

colorsStateHistory.destroy();

export class ColorStoreService {
  // select All Users Data
  colors$ = colorStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Color[]> {
    return this.colors$;
  }

  selectById(id: string): Observable<Color | undefined> {
    return colorStore.pipe(selectEntity(id));
  }

  upsertColors(colors: Color[]): void {
    colorStore.update(upsertEntities(colors));
  }

  addColor(color: Color): void {
    colorStore.update(addEntities([color]));
  }

  updateColor(color: Color): void {
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

  getById(id: string): Color | undefined {
    return colorStore.query(getEntity(id));
  }

  upsertById(color: Color): void {
    colorStore.update(addEntities(color));
  }

  deleteById(id: string): void {
    colorStore.update(deleteEntities(id));
  }
}
