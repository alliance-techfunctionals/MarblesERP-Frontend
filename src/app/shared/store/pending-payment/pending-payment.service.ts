import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { PendingPaymentStoreService } from './pending-payment.store';
import { PendingPaymentModel } from './pending-payment.model';
import { SubPendingPaymentModel } from '../sub-pending-payment/sub-pending-payment.model';
import { error } from 'console';

@Injectable({ providedIn: 'root' })
export class PendingPaymentService {

  constructor(
    protected store: PendingPaymentStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All custom order list
  getAll(): Observable<PendingPaymentModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllPendingPayment().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on Getting Pending Payments:', error);
              return EMPTY;
            }
          }),
          tap((records: PendingPaymentModel[]) => {
            this.store.upsertPendingPayments(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

  sendReminder(list: number[]):Observable<boolean>{
    if(list.length > 0){
      return this.CarpetInventoryService.sendReminder(list).pipe(
        catchError(error => {
          this.messageService.error('Error on send reminder:',error);
          return EMPTY;
        }),
        tap((res: boolean) => {
          this.messageService.success('Reminder Send Successfully');
        })
      )
    }
    else{
      return EMPTY;
    }
  }

  // insert and update customOrder
  // upsertPendingPayment(pendingPayment: PendingPaymentModel): Observable<PendingPaymentModel> {
  //   if (pendingPayment.id === 0) {
  //     return this.CarpetInventoryService.insertPendingPayment(pendingPayment).pipe(
  //       catchError(error => {
  //         this.messageService.error('Error on insert pendingPayment:', error);
  //         return EMPTY;
  //       }),
  //       tap((response: PendingPaymentModel) => {
  //         this.messageService.success('pendingPayment insert successfully');
  //         this.store.upsertById(response);
  //       })
  //     );
  //   }
  //   else {
  //     return this.CarpetInventoryService.updatePendingPayment(pendingPayment).pipe(
  //       catchError(error => {
  //         this.messageService.error('Error on update pendingPayment:', error);
  //         return EMPTY;
  //       }),
  //       tap((response) => {
  //         this.messageService.success('pendingPayment update successfully');
  //         this.store.updatePendingPayment(response);
  //       })
  //     );
  //   }
  // }

  // delete pending payment
  // deletePendingPayment(pendingPayment: PendingPaymentModel): void {
  //   this.CarpetInventoryService.deletePendingPayment(pendingPayment).pipe(
  //     catchError(error => {
  //       this.messageService.error('Error on delete pending payment:', error);
  //       return EMPTY;
  //     }),
  //     tap((_response: PendingPaymentModel) => {
  //       this.store.deleteById(pendingPayment.id);
  //       this.messageService.success('pending payment delete successfully');
  //     })
  //   ).subscribe();
  // }

}
