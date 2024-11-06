import { createStore } from "@ngneat/elf";
import { addEntities, deleteEntities, getEntity, selectAllEntities, setEntities, updateEntities, upsertEntities, withEntities } from "@ngneat/elf-entities";
import { PurchaseModel } from "./purchase.model";
import { entitiesStateHistory } from "@ngneat/elf-state-history";
import { Observable, of, switchMap } from "rxjs";

const purchaseVoucherStore = createStore(
    { name: 'purchaseVoucher', },
    withEntities<PurchaseModel, 'id'>({ idKey: 'id' }),
  );
  const purchaseStateHistory = entitiesStateHistory(purchaseVoucherStore,{
    maxAge: 2
  });

  purchaseStateHistory.destroy();
  export class PurchaseVoucherStoreService {

    purchase$ = purchaseVoucherStore.pipe(selectAllEntities());

    constructor() { }
  
    selectAll(): Observable<PurchaseModel[]> {
      return this.purchase$;
    }
  
    upsertPurchaseVoucher(purchaseVoucher: PurchaseModel[]): void {
        purchaseVoucherStore.update(upsertEntities(purchaseVoucher))
    }
  
    addTodo(purchaseVoucher: PurchaseModel): void {
        purchaseVoucherStore.update(addEntities([purchaseVoucher]));
    }
  
    updatePurchaseVoucher(purchaseVoucher: PurchaseModel): void {
        purchaseVoucherStore.update(
        updateEntities(purchaseVoucher.id, purchaseVoucher)
      );
    }
  
    deletePurchaseVoucher(id: number): void {
        purchaseVoucherStore.update(deleteEntities(id));
    }
  
    selectHasCache(): Observable<boolean> {
      return this.purchase$.pipe(
        switchMap((item) => item.length > 0 ? of(true) : of(false))
      )
  
    }
  
    getById(id: number): PurchaseModel | undefined {
      return purchaseVoucherStore.query(getEntity(id))
    }
  
    upsertById(purchaseVoucher: PurchaseModel): void {
        purchaseVoucherStore.update(addEntities(purchaseVoucher));
      // purchaseVoucherStore.reset();
    }
  
    deleteById(id: number): void {
        purchaseVoucherStore.update(deleteEntities(id));
    }
  
    resetPurchaseVoucherStore(): void{
      purchaseVoucherStore.update(setEntities([]));
    }
  

  }
  