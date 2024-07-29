import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { CustomOrderModel } from './custom-order.model';
import { CustomOrderStoreService } from './custom-order.store';
import { CarpetInventoryHttpService } from '../../service/carpet-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class CustomOrderService {

  constructor(
    protected store: CustomOrderStoreService,
    private CarpetInventoryService: CarpetInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All custom order list
  getAll(): Observable<CustomOrderModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllCustomOrder().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on getting custom orders:', error);
              return EMPTY;
            }
          }),
          tap((records: CustomOrderModel[]) => {
            this.store.upsertCustomOrders(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

  // insert and update customOrder
  upsertCustomOrder(customOrder: CustomOrderModel): Observable<CustomOrderModel> {
    if (customOrder.id === 0) {
      return this.CarpetInventoryService.insertCustomOrder(customOrder).pipe(
        catchError(error => {
          this.messageService.error('Error on insert customOrder:', error);
          return EMPTY;
        }),
        tap((response: CustomOrderModel) => {
          this.messageService.success('Custom Order Saved Successfully');
          this.store.upsertById(response);
        })
      );
    }
    else {
      return this.CarpetInventoryService.updateCustomOrder(customOrder).pipe(
        catchError(error => {
          this.messageService.error('Error on Update Custom Order:', error);
          return EMPTY;
        }),
        tap((response) => {
          this.messageService.success('Custom Order Updated Successfully');
          this.store.updateCustomOrder(response);
        })
      );
    }
  }

  // delete customOrder
  deleteCustomOrder(customOrder: CustomOrderModel): void {
    this.CarpetInventoryService.deleteCustomOrder(customOrder).pipe(
      catchError(error => {
        this.messageService.error('Error on delete customOrder:', error);
        return EMPTY;
      }),
      tap((_response: CustomOrderModel) => {
        this.store.deleteById(customOrder.id);
        this.messageService.success('Custom Order Deleted Successfully');
      })
    ).subscribe();
  }

  // custom order received
  orderReceived(customOrder: CustomOrderModel): void{
    this.CarpetInventoryService.orderReceived(customOrder).pipe(
      catchError(error => {
        this.messageService.error('Error on Custom Order Received:', error);
        return EMPTY;
      }),
      tap((_response: string) => {
        this.store.deleteById(customOrder.id);
        this.messageService.success('Custom Order Received Successfully');
      })
    ).subscribe();
  }

}
