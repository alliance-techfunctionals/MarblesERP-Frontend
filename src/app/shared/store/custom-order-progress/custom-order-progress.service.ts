import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { CustomOrderProgressModel } from './custom-order-progress.model';
import { CustomOrderProgressStoreService } from './custom-order-progress.store';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class CustomOrderProgressService {

  constructor(
    protected store: CustomOrderProgressStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All custom order list
  getAll(id: number): Observable<CustomOrderProgressModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllCustomOrderProgresses(id).pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on getting custom order progress:', error);
              return EMPTY;
            }
          }),
          tap((records: CustomOrderProgressModel[]) => {
            this.store.upsertCustomOrderProgress(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

  // insert and update custom Order Progress
  upsertCustomProgressOrder(customOrderProgress: CustomOrderProgressModel): Observable<CustomOrderProgressModel> {
    if (customOrderProgress.id === 0) {
      return this.CarpetInventoryService.insertCustomOrderProgress(customOrderProgress).pipe(
        catchError(error => {
          this.messageService.error('Error on insert Custom Order Progress:', error);
          return EMPTY;
        }),
        tap((response: CustomOrderProgressModel) => {
          this.messageService.success('Custom Order Progress Saved Successfully');
          this.store.upsertById(response);
        })
      );
    }
    else {
      return this.CarpetInventoryService.updateCustomOrderProgress(customOrderProgress).pipe(
        catchError(error => {
          this.messageService.error('Error on Update Custom Order Progress:', error);
          return EMPTY;
        }),
        tap((response) => {
          this.messageService.success('Custom Order Progress Updated Successfully');
          this.store.updateCustomOrderProgress(response);
        })
      );
    }
  }

  // delete custom  Order Progress
  deleteCustomOrderProgress(customOrderProgress: CustomOrderProgressModel): void {
    this.CarpetInventoryService.deleteCustomOrderProgress(customOrderProgress).pipe(
      catchError(error => {
        this.messageService.error('Error on Delete Custom Order Progress:', error);
        return EMPTY;
      }),
      tap((_response: CustomOrderProgressModel) => {
        this.store.deleteById(customOrderProgress.id);
        console.log(customOrderProgress.id)
        this.messageService.success('Custom Order Progress Deleted Successfully');
      })
    ).subscribe();
  }

}
