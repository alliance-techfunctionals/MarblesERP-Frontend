import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { DesignStoreService } from './design.store';
import { Design, DesignResponse } from './design.model';
import { CarpetInventoryHttpService } from '../../service/carpet-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class DesignService {

  constructor(
    private router: Router,
    protected store: DesignStoreService,
    private CarpetInventoryService: CarpetInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All Design list
  getAll(): Observable<Design[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllDesign().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on getting design:', error);
              return EMPTY;
            }
          }),
          tap((records: DesignResponse[]) => {
            const mappedResult: Design[] = records.map((d) => ({
              name: d.name,
              id: d.id
            }));
            this.store.upsertDesigns(mappedResult);
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

}
