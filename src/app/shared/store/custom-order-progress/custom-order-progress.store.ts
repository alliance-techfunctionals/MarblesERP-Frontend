import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, selectAllEntitiesApply, updateEntities, setEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { CustomOrderProgressModel } from './custom-order-progress.model';
import { entitiesStateHistory } from '@ngneat/elf-state-history';

const customOrderProgressStore = createStore(
  { name: 'customOrderProgress', },
  withEntities<CustomOrderProgressModel, 'id'>({ idKey: 'id' }),
);

const customOrderProgressStateHistory = entitiesStateHistory(customOrderProgressStore, {
  maxAge: 2
});

customOrderProgressStateHistory.destroy();

export class CustomOrderProgressStoreService {
  // select All custom Order Data
  customOrderProgress$ = customOrderProgressStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<CustomOrderProgressModel[]> {
    return this.customOrderProgress$;
  }

  selectById(id: number): Observable<CustomOrderProgressModel | undefined> {
    return customOrderProgressStore.pipe(selectEntity(id));
  }

  upsertCustomOrderProgress(customOrderProgress: CustomOrderProgressModel[]): void {
    customOrderProgressStore.update(upsertEntities(customOrderProgress))
  }

  addTodo(customOrderProgress: CustomOrderProgressModel): void {
    customOrderProgressStore.update(addEntities([customOrderProgress]));
  }

  updateCustomOrderProgress(customOrderProgress: CustomOrderProgressModel): void {
    customOrderProgressStore.update(
      updateEntities(customOrderProgress.id, customOrderProgress)
    );
  }

  deleteCustomOrderProgress(id: number): void {
    customOrderProgressStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.customOrderProgress$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): CustomOrderProgressModel | undefined {
    return customOrderProgressStore.query(getEntity(id))
  }

  upsertById(customOrderProgress: CustomOrderProgressModel): void {
    customOrderProgressStore.update(addEntities(customOrderProgress));

  }

  deleteById(id: number): void {
    customOrderProgressStore.update(deleteEntities(id));

  }

  resetStore(): void{
    customOrderProgressStore.update(setEntities([]));
  }


}

