import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, selectAllEntitiesApply, updateEntities, setEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { CustomOrderModel } from './custom-order.model';
import { entitiesStateHistory } from '@ngneat/elf-state-history';

const customOrderStore = createStore(
  { name: 'customOrder', },
  withEntities<CustomOrderModel, 'id'>({ idKey: 'id' }),
);

const customOrderStateHistory = entitiesStateHistory(customOrderStore, {
  maxAge: 2
});

customOrderStateHistory.destroy();

export class CustomOrderStoreService {
  // select All custom Order Data
  customOrder$ = customOrderStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<CustomOrderModel[]> {
    return this.customOrder$;
  }

  selectById(id: number): Observable<CustomOrderModel | undefined> {
    return customOrderStore.pipe(selectEntity(id));
  }

  upsertCustomOrders(customOrders: CustomOrderModel[]): void {
    customOrderStore.update(upsertEntities(customOrders))
  }

  addTodo(customOrder: CustomOrderModel): void {
    customOrderStore.update(addEntities([customOrder]));
  }

  updateCustomOrder(customOrder: CustomOrderModel): void {
    customOrderStore.update(
      updateEntities(customOrder.id, customOrder)
    );
  }

  deleteCustomOrder(id: number): void {
    customOrderStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.customOrder$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): CustomOrderModel | undefined {
    return customOrderStore.query(getEntity(id))
  }

  upsertById(customOrder: CustomOrderModel): void {
    customOrderStore.update(addEntities(customOrder));

  }
  resetStore(): void{
    customOrderStore.update(setEntities([]));
  }

  deleteById(id: number): void {
    customOrderStore.update(deleteEntities(id));

  }


}

