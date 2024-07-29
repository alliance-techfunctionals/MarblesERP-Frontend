import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, selectAllEntitiesApply, updateEntities, setEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { SubPendingPaymentModel } from './sub-pending-payment.model';
import { entitiesStateHistory } from '@ngneat/elf-state-history';

const subPendingPaymentStore = createStore(
  { name: 'subPendingPayment', },
  withEntities<SubPendingPaymentModel, 'id'>({ idKey: 'id' }),
);

const subPendingPaymentStateHistory = entitiesStateHistory(subPendingPaymentStore, {
  maxAge: 2
});

subPendingPaymentStateHistory.destroy();

export class SubPendingPaymentStoreService {
  // select All Pending Payments Data
  subPendingPayment$ = subPendingPaymentStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<SubPendingPaymentModel[]> {
    return this.subPendingPayment$;
  }

  selectById(id: number): Observable<SubPendingPaymentModel | undefined> {
    return subPendingPaymentStore.pipe(selectEntity(id));
  }

  upsertSubPendingPayments(subPendingPayments: SubPendingPaymentModel[]): void {
    subPendingPaymentStore.update(upsertEntities(subPendingPayments))
  }

  addTodo(subPendingPayment: SubPendingPaymentModel): void {
    subPendingPaymentStore.update(addEntities([subPendingPayment]));
  }

  updateSubPendingPayment(subPendingPayment: SubPendingPaymentModel): void {
    subPendingPaymentStore.update(
      updateEntities(subPendingPayment.id, subPendingPayment)
    );
  }

  deleteSubPendingPayment(id: number): void {
    subPendingPaymentStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.subPendingPayment$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): SubPendingPaymentModel | undefined {
    return subPendingPaymentStore.query(getEntity(id))
  }

  upsertById(subPendingPayment: SubPendingPaymentModel): void {
    subPendingPaymentStore.update(addEntities(subPendingPayment));

  }

  deleteById(id: number): void {
    subPendingPaymentStore.update(deleteEntities(id));

  }

  resetSubPendingPaymentStore(): void{
    subPendingPaymentStore.update(setEntities([]));
  }
}

