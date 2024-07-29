// import { Observable, of, switchMap } from 'rxjs';
// import { selectAllEntities, withEntities, getEntity, addEntities, deleteEntities, upsertEntities, upsertEntitiesById, selectEntity } from '@ngneat/elf-entities';

// import { createStore } from '@ngneat/elf';
// import { entitiesStateHistory } from '@ngneat/elf-state-history';
// import { SalesMan } from './salesMan.model';

// const salesManStore = createStore(
//   { name: 'salesMan', },
//   withEntities<SalesMan, 'id'>({ idKey: 'id' }),
// );

//  const salesManStoresStateHistory = entitiesStateHistory(salesManStore, {
//   maxAge: 2
// });

// salesManStoresStateHistory.destroy();

// export class SalesManStoreService {
//   // select All salesMan
//   salesMan$ = salesManStore.pipe(selectAllEntities());

//   constructor() { }

//   selectAll(): Observable<SalesMan[]> {
//     return this.salesMan$;
//   }

//   selectById(id:number): Observable<SalesMan | undefined> {
//     return salesManStore.pipe(selectEntity(id));
//   }

//   upsertSalesMan(salesMan: SalesMan[]): void {
//     salesManStore.update(upsertEntities(salesMan))
//   }

//   addSalesMan(salesMan: SalesMan): void {
//     salesManStore.update(addEntities([salesMan]));
//   }

//   updateSalesMan(salesMan: SalesMan): void {
//     salesManStore.update(addEntities({ ...salesMan, id: salesMan.id }));
//   }

//   deleteSalesMan(id: number): void {
//     salesManStore.update(deleteEntities(id));
//   }

//   selectHasCache(): Observable<boolean> {
//     return this.salesMan$.pipe(
//       switchMap((item) => item.length > 0 ? of(true) : of(false))
//     )

//   }

//   getById(id: number): SalesMan | undefined {
//     return salesManStore.query(getEntity(id))
//   }

//   upsertById(salesMan: SalesMan): void {
//     salesManStore.update(addEntities(salesMan));

//   }

//   deleteById(id: number): void {
//     salesManStore.update(deleteEntities(id));

//   }


// }

