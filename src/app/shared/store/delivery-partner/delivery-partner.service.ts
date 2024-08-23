import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { DeliveryPartnerModel } from './delivery-partner.model';
import { DeliveryPartnerStoreService } from './delivery-partner.store';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class DeliveryPartnerService {

  constructor(
    protected store: DeliveryPartnerStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All DeliveryPartner list
  getAll(): Observable<DeliveryPartnerModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllDeliveryPartners().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on getting delivery partners:', error);
              return EMPTY;
            }
          }),
          tap((records: DeliveryPartnerModel[]) => {
            this.store.upsertDeliveryPartners(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

  // insert and update DeliveryPartner
  upsertDeliveryPartner(deliveryPartner: DeliveryPartnerModel): Observable<DeliveryPartnerModel> {
    if (deliveryPartner.id === 0) {
      return this.CarpetInventoryService.insertDeliveryPartner(deliveryPartner).pipe(
        catchError(error => {
          this.messageService.error('Error on insert Delivery Partner:', error);
          return EMPTY;
        }),
        tap((response: DeliveryPartnerModel) => {
          this.messageService.success('Delivery Partner Saved Successfully');
          this.store.upsertById(response);
        })
      );
    }
    else {
      return EMPTY;
    }
  }

}
