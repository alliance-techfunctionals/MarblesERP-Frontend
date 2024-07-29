import { Observable, map, of, switchMap } from "rxjs";
import {
  selectAllEntities,
  withEntities,
  getEntity,
  addEntities,
  deleteEntities,
  upsertEntities,
  upsertEntitiesById,
  updateEntities,
  selectEntity,
} from "@ngneat/elf-entities";

import { createStore } from "@ngneat/elf";
import { VoucherModel, voucher } from "./voucher.model";
import { entitiesStateHistory } from "@ngneat/elf-state-history";

const voucherStore = createStore(
  { name: "voucher" },
  withEntities<VoucherModel, "id">({ idKey: "id" })
);

const vouchersStateHistory = entitiesStateHistory(voucherStore, {
  maxAge: 2,
});

vouchersStateHistory.destroy();

export class VoucherStoreService {
  // select All inventories Data
  vouchers$ = voucherStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<VoucherModel[]> {
    return this.vouchers$;
  }

  selectById(voucherId: number): Observable<VoucherModel | undefined>{
    return voucherStore.pipe(selectEntity(voucherId));
  }

  upsertVouchers(vouchers: VoucherModel[]): void {
    voucherStore.update(upsertEntities(vouchers));
  }

  addTodo(voucher: VoucherModel): void {
    voucherStore.update(addEntities([voucher]));
  }

  updateVoucher(voucher: VoucherModel): void {
    voucherStore.update(
      updateEntities(voucher.id, voucher)
    );
  }

  deleteVoucher(id: number): void {
    voucherStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.vouchers$.pipe(
      switchMap((item) => (item.length > 0 ? of(true) : of(false)))
    );
  }

  getById(id: number): VoucherModel | undefined {
    return voucherStore.query(getEntity(id));
  }

  upsertById(voucher: VoucherModel): void {
    voucherStore.update(addEntities(voucher));
  }

  deleteById(id: number): void {
    voucherStore.update(deleteEntities(id));
  }

  // save latest voucher number
  upsertVoucherNo(voucherNo: string): void {
    voucherStore.update((state) => ({ ...state, voucherCode: voucherNo }));
  }

  filterByDateRange(fromDate: Date, toDate: Date): Observable<VoucherModel[]> {
    return this.vouchers$.pipe(
      map(vouchers => vouchers.filter(voucher =>
        voucher.voucherDate >= fromDate && voucher.voucherDate <= toDate,
      ))
    );
  }

  // get Voucher Number
  getVoucherNo(): Observable<VoucherModel[]> {
    return this.vouchers$;
  }
}
