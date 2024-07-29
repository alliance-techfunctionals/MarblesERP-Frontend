import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, selectAllEntitiesApply, updateEntities, setEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { PendingPaymentModel } from './pending-payment.model';
import { entitiesStateHistory } from '@ngneat/elf-state-history';

const pendingPaymentStore = createStore(
  { name: 'pendingPayment', },
  withEntities<PendingPaymentModel, 'id'>({ idKey: 'id' }),
);

const pendingPaymentStateHistory = entitiesStateHistory(pendingPaymentStore, {
  maxAge: 2
});

pendingPaymentStateHistory.destroy();

export class PendingPaymentStoreService {
  // select All Pending Payments Data
  pendingPayment$ = pendingPaymentStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<PendingPaymentModel[]> {
    return this.pendingPayment$;
  }

  selectById(id: number): Observable<PendingPaymentModel | undefined> {
    return pendingPaymentStore.pipe(selectEntity(id));
  }

  // selectByRoleId(id: number = 2000): Observable<PendingPaymentModel[]> {
  //   return pendingPaymentStore.pipe(
  //     selectAllEntitiesApply({
  //       filterEntity: (e) => e.roleId === id,
  //     })
  //   );
  // }

  upsertPendingPayments(pendingPayments: PendingPaymentModel[]): void {
    pendingPaymentStore.update(upsertEntities(pendingPayments))
  }

  addTodo(pendingPayment: PendingPaymentModel): void {
    pendingPaymentStore.update(addEntities([pendingPayment]));
  }

  updatePendingPayment(pendingPayment: PendingPaymentModel): void {
    pendingPaymentStore.update(
      updateEntities(pendingPayment.id, pendingPayment)
    );
  }

  deletePendingPayment(id: number): void {
    pendingPaymentStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.pendingPayment$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): PendingPaymentModel | undefined {
    return pendingPaymentStore.query(getEntity(id))
  }

  upsertById(pendingPayment: PendingPaymentModel): void {
    pendingPaymentStore.update(addEntities(pendingPayment));

  }

  deleteById(id: number): void {
    pendingPaymentStore.update(deleteEntities(id));

  }

  resetPendingPaymentStore(): void{
    pendingPaymentStore.update(setEntities([]));
  }

}

