import { EMPTY, Observable, map, of, switchMap } from 'rxjs';
import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, updateEntities, selectEntity, setEntities } from '@ngneat/elf-entities';

import { createStore } from '@ngneat/elf';
import { Sale, SaleModel } from './sale.model';
import { entitiesStateHistory } from '@ngneat/elf-state-history';
import { jwtDecode } from "jwt-decode";

const saleStore = createStore(
  { name: 'sale', },
  withEntities<SaleModel, 'id'>({ idKey: 'id' }),
);

const salesStateHistory = entitiesStateHistory(saleStore, {
  maxAge: 2
});

salesStateHistory.destroy();

export class SaleStoreService {
  // select All Sales Data
  sales$ = saleStore.pipe(selectAllEntities());

  constructor() { }

  selectAll(): Observable<SaleModel[]> {
    // Admin, employee, operation, and production can see all the list of sales
    if (this.getRole() == 1000 || this.getRole() == 3000 || this.getRole() == 6000 || this.getRole() == 7000){
      return this.sales$;
    }
    else if(this.getRole() == 2000){
      console.log(this.getUserId())
      return this.sales$.pipe(
        map(sales => sales.filter(
          sale => sale.salesManId == this.getUserId()
        ))
      )
    }
    else {
      return EMPTY;
    }
  }

  selectById(id: number): Observable<Sale | undefined> {
    return saleStore.pipe(selectEntity(id));
  }

  upsertSales(sales: SaleModel[]): void {
    saleStore.update(upsertEntities(sales))
  }

  addTodo(sale: SaleModel): void {
    saleStore.update(addEntities([sale]));
  }

  updateSale(sale: SaleModel): void {
    saleStore.update(
      updateEntities(sale.id, sale)
    );
  }

  deleteSale(id: number): void {
    saleStore.update(deleteEntities(id));
  }

  selectHasCache(): Observable<boolean> {
    return this.sales$.pipe(
      switchMap((item) => item.length > 0 ? of(true) : of(false))
    )

  }

  getById(id: number): SaleModel | undefined {
    return saleStore.query(getEntity(id))
  }

  upsertById(sale: SaleModel): void {
    saleStore.update(addEntities(sale));

  }

  deleteById(id: number): void {
    saleStore.update(deleteEntities(id));
  }

  filterByDateRange(fromDate: Date, toDate: Date): Observable<SaleModel[]> {
    return this.sales$.pipe(
      map(sales => sales.filter(sale =>
        sale.orderDate >= fromDate && sale.orderDate <= toDate
      ))
    );
  }

  resetSaleStore(): void{
    saleStore.update(setEntities([]));
  }

  getRole(): Number{
    const token = localStorage.getItem('Token');
    if(token){
      const decodedToken: any = jwtDecode(token)
      const userRole = decodedToken["UserRole"]
      return userRole;
    }
    return 0;
  }

  getUserId(): Number{
    const token = localStorage.getItem('Token');
    if(token){
      const decodedToken: any = jwtDecode(token)
      const userId = decodedToken["Id"]
      return userId;
    }
    return 0;
  }

}

