import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, updateEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { entitiesStateHistory } from '@ngneat/elf-state-history';
import { Customer } from './customer.model';

const customerStore = createStore(
  { name: 'customer', },
  withEntities<Customer, 'id'>({ idKey: 'id' }),
);

const customersStateHistory = entitiesStateHistory(customerStore, {
  maxAge: 2
});

customersStateHistory.destroy();

export class CustomerStoreService {
  // select All Users Data
  customers$ = customerStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<Customer[]> {
    return this.customers$;
  }

  selectById(id: number): Observable<Customer | undefined> {
    return customerStore.pipe(selectEntity(id));
  }

  upsertCustomers(customers: Customer[]): void {
    customerStore.update(upsertEntities(customers))
  }

  addCustomer(customer: Customer): void {
    customerStore.update(addEntities([customer]));
  }

  updateCustomer(customer: Customer): void {
    customerStore.update(
      updateEntities(customer.id, customer)
    );
  }

  deleteCustomer(id: number): void {
    customerStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.customers$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): Customer | undefined {
    return customerStore.query(getEntity(id))
  }

  upsertById(customer: Customer): void {
    customerStore.update(addEntities(customer));

  }

  deleteById(id: number): void {
    customerStore.update(deleteEntities(id));

  }


}

