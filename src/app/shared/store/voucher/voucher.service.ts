import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, map, switchMap, take, tap } from 'rxjs/operators';
import { VoucherModel } from './voucher.model';
import { VoucherStoreService } from './voucher.store';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class VoucherService {

  constructor(
    protected store: VoucherStoreService,
    private CarpetVoucherService: MarbleInventoryHttpService,
    private messageService: MessageToastService

  ) { }

  // get All Vouchers list
  getAll(): Observable<VoucherModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetVoucherService.getAllVoucher().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on Getting Voucher:', error);
              return EMPTY;
            }
          }),
          tap((records: VoucherModel[]) => {
            this.store.upsertVouchers(records);
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

  // insert and update Voucher
  // below in update and create
  // we are setting the datetime as IST bcoz its coming with Z suffix 
  // which indicates time is UTC
  upsertVoucher(voucher: VoucherModel): Observable<VoucherModel> {
    if (voucher.id === 0) {
      return this.CarpetVoucherService.insertVoucher(voucher).pipe(
        catchError(_error => {
          if(_error.status === 500){
            this.messageService.error(_error.error.message);  
          }
          else{
            this.messageService.error('Error on insert voucher');
          }
          return EMPTY;
        }),
        tap((response: VoucherModel) => {
          this.messageService.success('Voucher Saved Successfully');
          let date = new Date(response.voucherDate);
           // Subtract the time
          date.setUTCHours(date.getUTCHours() - 5);
          date.setUTCMinutes(date.getUTCMinutes() - 30);

          response.voucherDate = date;
          this.store.upsertById(response);
        })
      );
    }
    else {
      return this.CarpetVoucherService.updateVoucher(voucher).pipe(
        catchError(_error => {
          if(_error.status === 500){
            this.messageService.error(_error.error.message);  
          }
          else{
            this.messageService.error('Error on insert voucher');
          }
          return EMPTY;
        }),
        tap((response) => {
          this.messageService.success('Voucher Updated Successfully');
          let date = new Date(response.voucherDate);
           // Subtract the time
          date.setUTCHours(date.getUTCHours() - 5);
          date.setUTCMinutes(date.getUTCMinutes() - 30);

          response.voucherDate = date;
          this.store.updateVoucher(response);
        })
      );
    }
  }

  // delete voucher
  deleteVoucher(voucher: VoucherModel): void {
    this.CarpetVoucherService.deleteVoucher(voucher).pipe(
      catchError(_error => {
        this.messageService.error('Error on delete voucher');
        return EMPTY;
      }),
      tap((response: VoucherModel) => {
        this.store.deleteById(voucher.id);
        this.messageService.success('Voucher Deleted Successfully');
      })
    ).subscribe();
  }

  // get latest voucher number
  getVoucherNo(): Observable<string> {
    return this.CarpetVoucherService.getNextVoucherNo().pipe(
      catchError(_error => {
        const error = JSON.parse(_error.error);
        this.messageService.error(error['message']);
        return EMPTY;
      }),
      tap((response: string) => {
        this.store.upsertVoucherNo(response);
      })
    )
  }

}
