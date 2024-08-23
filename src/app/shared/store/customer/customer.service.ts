// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { EMPTY, Observable, of } from 'rxjs';
// import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
// import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
// import { CustomerStoreService } from './customer.store';
// import { Customer } from './customer.model';

// @Injectable({ providedIn: 'root' })
// export class CustomerService {

//   constructor(
//     private router: Router,
//     protected store: CustomerStoreService,
//     private CarpetInventoryService: MarbleInventoryHttpService
//   ) { }

//   // get All User list
//   getAll(): Observable<Customer[]> {
//     return this.store.selectHasCache().pipe(
//       take(1),
//       switchMap(hasCache => {
//         const request = this.CarpetInventoryService.getAllCustomer().pipe(
//           catchError(result => {
//             console.log('Error on getting roles:',result)
//             return EMPTY;
//           }),
//           tap((records: Customer[]) => {
//             this.store.upsertCustomers(records)
//           })
//         );
//         return hasCache ? of([]) : request;
//       }), delay(0)
//     );
//   }

// }
