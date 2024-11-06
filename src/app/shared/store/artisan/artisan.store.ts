import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, updateEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { entitiesStateHistory } from '@ngneat/elf-state-history';
import { Artisan } from './artisan.model';

const artisanStore = createStore(
  { name: 'artisan', },
  withEntities<Artisan, 'id'>({ idKey: 'id' }),
);

const artisansStateHistory = entitiesStateHistory(artisanStore, {
  maxAge: 2
});

artisansStateHistory.destroy();

export class ArtisanStoreService {
  // select All Users Data
  artisans$ = artisanStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Artisan[]> {
    return this.artisans$;
  }

  selectById(id: number): Observable<Artisan | undefined> {
    return artisanStore.pipe(selectEntity(id));
  }

  upsertArtisan(artisans: Artisan[]): void {
    artisanStore.update(upsertEntities(artisans))
  }

  addArtisan(artisan: Artisan): void {
    artisanStore.update(addEntities([artisan]));
  }

  updateArtisan(artisan: Artisan): void {
    artisanStore.update(
      updateEntities(artisan.id, artisan)
    );
  }

  deleteArtisan(id: number): void {
    artisanStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.artisans$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): Artisan | undefined {
    return artisanStore.query(getEntity(id))
  }

  upsertById(artisan: Artisan): void {
    artisanStore.update(addEntities(artisan));

  }

  deleteById(id: number): void {
    artisanStore.update(deleteEntities(id));

  }


}

