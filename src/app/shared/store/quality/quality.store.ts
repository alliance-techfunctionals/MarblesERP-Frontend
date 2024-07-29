import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, updateEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { entitiesStateHistory } from '@ngneat/elf-state-history';
import { Quality } from './quality.model';

const qualityStore = createStore(
  { name: 'quality', },
  withEntities<Quality, 'id'>({ idKey: 'id' }),
);

const qualitiesStateHistory = entitiesStateHistory(qualityStore, {
  maxAge: 2
});

qualitiesStateHistory.destroy();

export class QualityStoreService {
  // select All Users Data
  qualities$ = qualityStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Quality[]> {
    return this.qualities$;
  }

  selectById(id: number): Observable<Quality | undefined> {
    return qualityStore.pipe(selectEntity(id));
  }

  upsertQualities(qualities: Quality[]): void {
    qualityStore.update(upsertEntities(qualities))
  }

  addQuality(quality: Quality): void {
    qualityStore.update(addEntities([quality]));
  }

  updateQuality(quality: Quality): void {
    qualityStore.update(
      updateEntities(quality.id, quality)
    );
  }

  deleteQuality(id: number): void {
    qualityStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.qualities$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): Quality | undefined {
    return qualityStore.query(getEntity(id))
  }

  upsertById(quality: Quality): void {
    qualityStore.update(addEntities(quality));

  }

  deleteById(id: number): void {
    qualityStore.update(deleteEntities(id));

  }


}

