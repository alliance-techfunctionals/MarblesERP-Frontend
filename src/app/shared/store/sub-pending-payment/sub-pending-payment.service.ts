import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { SubPendingPaymentModel } from '../sub-pending-payment/sub-pending-payment.model';
import { SubPendingPaymentStoreService } from './sub-pending-payment.store';

@Injectable({ providedIn: 'root' })
export class SubPendingPaymentService {

  constructor(
    protected store: SubPendingPaymentStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All custom order list
  getAll(id: number): Observable<SubPendingPaymentModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllSubPendingList(id).pipe(
          catchError(error => {
            this.messageService.error('Error on getting sub pending payments:', error);
            return EMPTY;
          }),
          tap((records: SubPendingPaymentModel[]) => {
            this.store.upsertSubPendingPayments(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

  

  // insert and update customOrder
  upsertSubPendingPayment(subPendingPayment: SubPendingPaymentModel): Observable<SubPendingPaymentModel> {
      return this.CarpetInventoryService.updateSubPendingPayment(subPendingPayment).pipe(
        catchError(error => {
          this.messageService.error('Error on insert pendingPayment:', error);
          return EMPTY;
        }),
        tap((response: SubPendingPaymentModel) => {
          this.messageService.success('Pending Payment Updated Successfully');
          this.store.updateSubPendingPayment(response);
        })
      );
  }

  // insert and update customOrder
  patchSubPendingPayment(subPendingPaymentId: number, status: boolean): Observable<SubPendingPaymentModel> {
    return this.CarpetInventoryService.patchSubPendingPayment(subPendingPaymentId, status).pipe(
      catchError(error => {
        this.messageService.error('Error on insert pendingPayment:', error);
        return EMPTY;
      }),
      tap((response: SubPendingPaymentModel) => {
        this.messageService.success('Pending Payment Status Changed successfully');
        this.store.deleteById(response.id);
      })
    );
  }

  // delete pending payment
  deleteSubPendingPayment(subPendingPayment: SubPendingPaymentModel): void {
    this.CarpetInventoryService.deleteSubPendingPayment(subPendingPayment).pipe(
      catchError(error => {
        this.messageService.error('Error on delete pending payment:', error);
        return EMPTY;
      }),
      tap((_response: SubPendingPaymentModel) => {
        this.store.deleteById(subPendingPayment.id);
        this.messageService.success('Pending Payment Deleted Successfully');
      })
    ).subscribe();
  }

}
