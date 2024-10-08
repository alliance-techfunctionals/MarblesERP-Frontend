import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { SaleModel } from './sale.model';
import { SaleStoreService } from './sale.store';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { City, Country, State } from '../../service/open-source-data.service';

@Injectable({ providedIn: 'root' })
export class SaleService {

  constructor(
    private router: Router,
    protected store: SaleStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All Sale list
  getAll(): Observable<SaleModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllSale().pipe(
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
      return this.CarpetInventoryService.insertSale(sale).pipe(
        catchError(_error => {
          if(_error.status === 500){
            this.messageService.error(_error.error.innerException);  
          }
          else{
            this.messageService.error('Error on Inserting Sale');
          }
          return EMPTY;
        }),
        tap((response: SaleModel) => {
          // console.log({ response })
          this.store.upsertById(response);
          this.messageService.success('Sale Saved Successfully');
        })
      );
    }
    else {
      return this.CarpetInventoryService.updateSale(sale).pipe(
        catchError(_error => {
          if(_error.status === 500){
            this.messageService.error(_error.error.innerException);
          }
          else{
            this.messageService.error('Error on Updating Sale');
          }
          return EMPTY;
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
    this.CarpetInventoryService.deleteSale(sale).pipe(
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

  // check order number
  checkOrderNo(orderNo: string): Observable<boolean> {
    return this.CarpetInventoryService.isOrderNoExists(orderNo).pipe(
      catchError(_error => {
        this.messageService.error(_error.error.message);
        return EMPTY;
      }),
      tap((response: boolean) => {        
        return response;
      })
    );
  }

  getCountryList(): Observable<Country[]> {
    return this.CarpetInventoryService.getCountries().pipe(
      catchError(_error => {
        console.error('Error on getting country list:', _error.error.innerException)
        return EMPTY;
      }),
      tap((response: Country[]) => {
        
        return response;
      })
    );
  }

  getStateList(country: string): Observable<State[]> {
    return this.CarpetInventoryService.getStates(country).pipe(
      catchError(_error => {
        console.error('Error on getting State list:', _error.error.innerException)
        return EMPTY;
      }),
      tap((response: State[]) => {
        
        return response;
      })
    );
  }

  getCityList(state: string): Observable<City[]> {
    return this.CarpetInventoryService.getCities(state).pipe(
      catchError(_error => {
        console.error('Error on getting City list:', _error.error.innerException)
        return EMPTY;
      }),
      tap((response: City[]) => {
        
        return response;
      })
    );
  }

  // get latest voucher number
  getOrderNo(): Observable<string> {
    return this.CarpetInventoryService.getNextOrderNo().pipe(
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

}
