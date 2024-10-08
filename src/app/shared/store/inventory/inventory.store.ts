import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, updateEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { InventoryModel } from './inventory.model';
import { entitiesStateHistory } from '@ngneat/elf-state-history';

const inventoryStore = createStore(
  { name: 'inventory', },
  withEntities<InventoryModel, 'id'>({ idKey: 'id' }),
);

const inventoriesStateHistory = entitiesStateHistory(inventoryStore, {
  maxAge: 2
});

inventoriesStateHistory.destroy();

export class InventoryStoreService {
  // select All inventories Data
  inventories$ = inventoryStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<InventoryModel[]> {
    return this.inventories$;
  }

  upsertInventories(inventories: InventoryModel[]): void {
    inventoryStore.update(upsertEntities(inventories))
  }

  addTodo(inventory: InventoryModel): void {
    inventoryStore.update(addEntities([inventory]));
  }

  updateInventory(inventory: InventoryModel): void {
    inventoryStore.update(
      updateEntities(inventory.id, inventory)
    );
  }

  deleteInventory(id: number): void {
    inventoryStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.inventories$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): InventoryModel | undefined {
    return inventoryStore.query(getEntity(id))
  }

  upsertById(inventory: InventoryModel): void {
    inventoryStore.update(addEntities(inventory));
    // inventoryStore.reset();
  }

  deleteById(id: number): void {
    inventoryStore.update(deleteEntities(id));
  }


}

