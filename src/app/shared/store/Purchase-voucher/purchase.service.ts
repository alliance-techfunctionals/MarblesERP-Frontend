import { Router } from "@angular/router";
import { PurchaseVoucherStoreService } from "./purchase.store";
import { MarbleInventoryHttpService } from "../../service/marble-inventory.http.service";
import { MessageToastService } from "src/app/core/service/message-toast.service";
import { PurchaseModel } from "./purchase.model";
import { catchError, delay, EMPTY, Observable, of, switchMap, take, tap } from "rxjs";
import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class PurchaseVoucherService {
    
  constructor(
    private router: Router,
    protected store: PurchaseVoucherStoreService,
    private MarbleHttpService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get purchase Voucher list
  getAll(): Observable<PurchaseModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.MarbleHttpService.getPurchaseVoucher().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on getting Purchase Voucher:', error);
              return EMPTY;
            }
          }),
          tap((records: any) => {
            this.store.upsertPurchaseVoucher(records.data)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }


  // insert and update purchase
  upsertPurchaseVoucher(purchase: PurchaseModel): Observable<PurchaseModel> {
    if (purchase.id === 0) {
      return this.MarbleHttpService.insertPurchaseVoucher(purchase).pipe(
        catchError(_error => {
          this.messageService.error('Something Went Wrong');
          return EMPTY;
        }),
        tap((response: any) => {
          this.store.upsertById(response.data);
          // console.log(response);
          this.messageService.success('Purchase Inserted Successfully');
        })
      );
    }
    else {
      return this.MarbleHttpService.updatePurchaseVoucher(purchase).pipe(
        catchError(_error => {
          this.messageService.error('Something Went Wrong');
          return EMPTY;
        }),
        tap((response: any) => {
          this.messageService.success('Purchase Updated Successfully');
          console.log(response);
          this.store.updatePurchaseVoucher(response.data);
        })
      );
    }
  }

  // delete purchase
  deletePurchaseVoucher(purchase: PurchaseModel): void {
    this.MarbleHttpService.deletePurchaseVoucher(purchase).pipe(
      catchError(_error => {
        this.messageService.error('Error on delete purchase');
        return EMPTY;
      }),
      tap((response: PurchaseModel) => {
        this.store.deleteById(purchase.id);
        this.messageService.success('purchase Deleted Successfully');
      })
    ).subscribe();
  }

  printPurchaseVoucher(purchaseVoucherId: number): Observable<string> {
    return this.MarbleHttpService.printPurchaseVoucher(purchaseVoucherId).pipe(
      catchError(error => {
        console.error('Error caught:', error)
        if(error.status === 204){
          this.messageService.error('No Invoice Found');
        }
        else{
          this.messageService.error('Error on Getting Invoice:', error.error.message);
        }
        return EMPTY;
      }),
      tap((response: string) => {
        if(!response){
          // getting null when there is no inovice found
          this.messageService.error('No Invoice Found');
        }
      })
    );
  }
  
}
    

