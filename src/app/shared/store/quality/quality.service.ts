import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable, of } from "rxjs";
import { catchError, delay, switchMap, take, tap } from "rxjs/operators";
import { QualityStoreService } from "./quality.store";
import { Quality, QualityResponse } from "./quality.model";
import { MarbleInventoryHttpService } from "../../service/marble-inventory.http.service";
import { MessageToastService } from "src/app/core/service/message-toast.service";

@Injectable({ providedIn: "root" })
export class QualityService {
  constructor(
    private router: Router,
    protected store: QualityStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All Quality list
  getAll(): Observable<Quality[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap((hasCache) => {
        const request = this.CarpetInventoryService.getAllQuality().pipe(
          catchError((error) => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on Getting Quality:', error);
              return EMPTY;
            }
          }),
          tap((records: QualityResponse[]) => {
            const mappedResult: Quality[] = records.map((d) => ({
              name: d.name,
              id: d.id
            }));
            this.store.upsertQualities(mappedResult);
          })
        );
        return hasCache ? of([]) : request;
      }),
      delay(0)
    );
  }
}
