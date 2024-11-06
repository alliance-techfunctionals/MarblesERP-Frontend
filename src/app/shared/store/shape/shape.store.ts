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
import { Shape } from "./shape.model";

const shapeStore = createStore(
  { name: "shape" },
  withEntities<Shape, "name">({ idKey: "name" })
);

const shapesStateHistory = entitiesStateHistory(shapeStore, {
  maxAge: 2,
});

shapesStateHistory.destroy();

export class ShapeStoreService {
  // select All Users Data
  shape$ = shapeStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Shape[]> {
    return this.shape$;
  }

  selectById(id: string): Observable<Shape | undefined> {
    return shapeStore.pipe(selectEntity(id));
  }

  upsertShapes(shapes: Shape[]): void {
    shapeStore.update(upsertEntities(shapes));
  }

  addShape(shape: Shape): void {
    shapeStore.update(addEntities([shape]));
  }

  updateShape(shape: Shape): void {
    shapeStore.update(
      updateEntities(shape.name, shape)
    );
  }

  deleteShape(id: string): void {
    shapeStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.shape$.pipe(
      switchMap((item) => (item.length > 0 ? of(true) : of(false)))
    );
  }

  getById(id: string): Shape | undefined {
    return shapeStore.query(getEntity(id));
  }

  upsertById(shape: Shape): void {
    shapeStore.update(addEntities(shape));
  }

  deleteById(id: string): void {
    shapeStore.update(deleteEntities(id));
  }
}
