// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { EMPTY, Observable, of } from 'rxjs';
// import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
// import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
// import { SalesManStoreService } from './salesMan.store';
// import { SalesMan } from './salesMan.model';

// @Injectable({ providedIn: 'root' })
// export class RoleService {

//   constructor(
//     private router: Router,
//     protected store: SalesManStoreService,
//     private CarpetInventoryService: MarbleInventoryHttpService
//   ) { }

//   // get All User list
//   getAll(): Observable<SalesMan[]> {
//     return this.store.selectHasCache().pipe(
//       take(1),
//       switchMap(hasCache => {
//         const request = this.CarpetInventoryService.getAllSalesMan().pipe(
//           catchError(result => {
//             console.log('Error on getting salesMans:',result)
//             return EMPTY;
//           }),
//           tap((records: SalesMan[]) => {
//             this.store.upsertSalesMans(records)
//           })
//         );
//         return hasCache ? of([]) : request;
//       }), delay(0)
//     );
//   }

// }
