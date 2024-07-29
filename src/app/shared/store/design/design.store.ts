import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, updateEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { entitiesStateHistory } from '@ngneat/elf-state-history';
import { Design } from './design.model';

const designStore = createStore(
  { name: 'design', },
  withEntities<Design, 'id'>({ idKey: 'id' }),
);

const designsStateHistory = entitiesStateHistory(designStore, {
  maxAge: 2
});

designsStateHistory.destroy();

export class DesignStoreService {
  // select All Users Data
  designs$ = designStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Design[]> {
    return this.designs$;
  }

  selectById(id: number): Observable<Design | undefined> {
    return designStore.pipe(selectEntity(id));
  }

  upsertDesigns(designs: Design[]): void {
    designStore.update(upsertEntities(designs))
  }

  addDesign(design: Design): void {
    designStore.update(addEntities([design]));
  }

  updateDesign(design: Design): void {
    designStore.update(
      updateEntities(design.id, design)
    );
  }

  deletedesign(id: number): void {
    designStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.designs$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): Design | undefined {
    return designStore.query(getEntity(id))
  }

  upsertById(design: Design): void {
    designStore.update(addEntities(design));

  }

  deleteById(id: number): void {
    designStore.update(deleteEntities(id));

  }


}

