import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { CheckInventoryModel, InventoryModel } from './inventory.model';
import { InventoryStoreService } from './inventory.store';

@Injectable({ providedIn: 'root' })
export class InventoryService {

  constructor(
    private router: Router,
    protected store: InventoryStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All Inventories list
  getAll(): Observable<InventoryModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllInventory().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on getting inventory:', error);
              return EMPTY;
            }
          }),
          tap((records: InventoryModel[]) => {
            this.store.upsertInventories(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

  checkInventory(inventory: CheckInventoryModel): Observable<CheckInventoryModel>{
    return this.CarpetInventoryService.checkInventory(inventory).pipe(
      catchError(_error => {
        this.messageService.error('Error on Check Inventory');
        return EMPTY;
      }),
      tap((response: CheckInventoryModel) => {
      })
    )
  }

  // insert and update Inventory
  upsertInventory(inventory: InventoryModel): Observable<InventoryModel> {
    if (inventory.id === 0) {
      return this.CarpetInventoryService.insertInventory(inventory).pipe(
        catchError(_error => {
          this.messageService.error('Something Went Wrong');
          return EMPTY;
        }),
        tap((response: InventoryModel) => {
          this.store.upsertById(response);
          // console.log(response);
          this.messageService.success('Inventory Inserted Successfully');
        })
      );
    }
    else {
      return this.CarpetInventoryService.updateInventory(inventory).pipe(
        catchError(_error => {
          this.messageService.error('Something Went Wrong');
          return EMPTY;
        }),
        tap((response) => {
          this.messageService.success('Inventory Updated Successfully');
          console.log(response);
          this.store.updateInventory(response);
        })
      );
    }
  }

  // delete inventory
  deleteInventory(inventory: InventoryModel): void {
    this.CarpetInventoryService.deleteInventory(inventory).pipe(
      catchError(_error => {
        this.messageService.error('Error on delete inventory');
        return EMPTY;
      }),
      tap((response: InventoryModel) => {
        this.store.deleteById(inventory.id);
        this.messageService.success('Inventory Deleted Successfully');
      })
    ).subscribe();
  }

}
