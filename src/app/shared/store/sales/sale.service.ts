import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { ProductDetails, SaleModel } from './sale.model';
import { SaleStoreService } from './sale.store';
// import { MarbleInventoryHttpService } from '../../service/carpet-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { City, Country, State } from '../../service/open-source-data.service';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';

@Injectable({ providedIn: 'root' })
export class SaleService {

  constructor(
    private router: Router,
    protected store: SaleStoreService,
    private MarbleInventoryHttpService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All Sale list
  getAll(): Observable<SaleModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.MarbleInventoryHttpService.getAllSale().pipe(
          catchError(_error => {
            if(_error.status === 500){
              this.messageService.error(_error.error.innerException);
            }
            else{
              this.messageService.error('Error on Getting Sales');
            }
            return EMPTY;
          }),
          tap((records: SaleModel[]) => {
            this.store.upsertSales(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }


  // insert and update Sale
  upsertSale(sale: SaleModel): Observable<SaleModel> {
    if (sale.id === 0) {
      return this.MarbleInventoryHttpService.insertSale(sale).pipe(
        catchError(_error => {
          if(_error.status === 500){
            this.messageService.error(_error.error.message);  
          }
          else{
            this.messageService.error('Error on Inserting Sale');
          }
          return throwError(_error);
        }),
        tap((response: SaleModel) => {
          // console.log({ response })
          this.store.upsertById(response);
          this.messageService.success('Sale Saved Successfully');
        })
      );
    }
    else {
      return this.MarbleInventoryHttpService.updateSale(sale).pipe(
        catchError(_error => {
          if(_error.status === 500){
            this.messageService.error(_error.error.message);
          }
          else{
            this.messageService.error('Error on Updating Sale');
          }
          return throwError(_error);
        }),
        tap((response) => {
          // console.log({ response })
          this.store.updateSale(response);
          this.messageService.success('Sale Updated Successfully');
        })
      );
    }
  }

  // delete sale
  deleteSale(sale: SaleModel): void {
    this.MarbleInventoryHttpService.deleteSale(sale).pipe(
      catchError(error => {
        console.error('Error on getting sales:', error)
        return EMPTY;
      }),
      tap((response: SaleModel) => {
        this.store.deleteById(sale.id);
        this.messageService.success('Sale Deleted successfully');
      })
    ).subscribe();
  }

  // delete sale
  cancelSale(sale: SaleModel, comment: string): void {
    this.MarbleInventoryHttpService.cancelSale(sale, comment).pipe(
      catchError(error => {
        console.error('Error on getting sales:', error)
        return EMPTY;
      }),
      tap((response: boolean) => {
        if(response){
          // this.store.deleteById(sale.id);
          this.store.cancelById(sale.id, {isCancelled: true});
          this.messageService.success('Sale Cancelled successfully');
        }else {
          this.messageService.error('Failed to cancel sale');
        }
      })
    ).subscribe();
  }

  // check order number
  checkOrderNo(orderNo: string): Observable<boolean> {
    return this.MarbleInventoryHttpService.isOrderNoExists(orderNo).pipe(
      catchError(_error => {
        this.messageService.error(_error.error.message);
        return EMPTY;
      }),
      tap((response: boolean) => {        
        return response;
      })
    );
  }

  getCountryList(): Observable<any[]> {
    return this.MarbleInventoryHttpService.getCountries().pipe(
      catchError(_error => {
        console.error('Error on getting country list:', _error.error.innerException)
        return EMPTY;
      }),
      tap((response: any[]) => {
        
        return response;
      })
    );
  }

  getStateList(country: string): Observable<any[]> {
    return this.MarbleInventoryHttpService.getStates(country).pipe(
      catchError(_error => {
        console.error('Error on getting State list:', _error.error.innerException)
        return EMPTY;
      }),
      tap((response: any[]) => {
        
        return response;
      })
    );
  }

  getCityList(state: string): Observable<any[]> {
    return this.MarbleInventoryHttpService.getCities(state).pipe(
      catchError(_error => {
        console.error('Error on getting City list:', _error.error.innerException)
        return EMPTY;
      }),
      tap((response: any[]) => {
        
        return response;
      })
    );
  }

  // get latest voucher number
  getOrderNo(): Observable<string> {
    return this.MarbleInventoryHttpService.getNextOrderNo().pipe(
      catchError(_error => {
        const error = JSON.parse(_error.error);
        this.messageService.error(error['message']);
        return EMPTY;
      }),
      tap((response: string) => {
        // this.store.up(response);
      })
    )
  }

  getByProductCode(productCode: string): Observable<any> {
    return this.MarbleInventoryHttpService.getByProductCode(productCode).pipe(
      catchError(_error => {
        this.messageService.error(_error.error.message);
        return EMPTY;
      }),
      tap((response: any) => {
        this.messageService.success('Product Fetched Successfully');
        return response.data;
      })
    )
  }

}
