import { Observable, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity, selectAllEntitiesApply, updateEntities, setEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { DeliveryPartnerModel } from './delivery-partner.model';
import { entitiesStateHistory } from '@ngneat/elf-state-history';

const deliveryPartnerStore = createStore(
  { name: 'deliveryPartner', },
  withEntities<DeliveryPartnerModel, 'id'>({ idKey: 'id' }),
);

const deliveryPartnersStateHistory = entitiesStateHistory(deliveryPartnerStore, {
  maxAge: 2
});

deliveryPartnersStateHistory.destroy();

export class DeliveryPartnerStoreService {
  // select All delivery partners Data
  deliveryPartners$ = deliveryPartnerStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<DeliveryPartnerModel[]> {
    return this.deliveryPartners$;
  }

  selectById(id: number): Observable<DeliveryPartnerModel | undefined> {
    return deliveryPartnerStore.pipe(selectEntity(id));
  }

  upsertDeliveryPartners(deliveryPartners: DeliveryPartnerModel[]): void {
    deliveryPartnerStore.update(upsertEntities(deliveryPartners))
  }

  addTodo(deliveryPartner: DeliveryPartnerModel): void {
    deliveryPartnerStore.update(addEntities([deliveryPartner]));
  }

  updateDeliveryPartner(deliveryPartner: DeliveryPartnerModel): void {
    deliveryPartnerStore.update(
      updateEntities(deliveryPartner.id, deliveryPartner)
    );
  }

  deleteDeliveryPartner(id: number): void {
    deliveryPartnerStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.deliveryPartners$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): DeliveryPartnerModel | undefined {
    return deliveryPartnerStore.query(getEntity(id))
  }

  upsertById(deliveryPartner: DeliveryPartnerModel): void {
    deliveryPartnerStore.update(addEntities(deliveryPartner));

  }

  deleteById(id: number): void {
    deliveryPartnerStore.update(deleteEntities(id));

  }

  resetdeliveryPartnerStore(): void{
    deliveryPartnerStore.update(setEntities([]));
  }

}

