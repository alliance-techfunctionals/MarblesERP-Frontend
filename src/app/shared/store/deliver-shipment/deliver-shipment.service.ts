import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { Shipping } from './delivery-shipment.model';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { DeliveryPartnerStoreService } from '../delivery-partner/delivery-partner.store';
import { SaleStoreService } from '../sales/sale.store';

@Injectable({ providedIn: 'root' })
export class DeliveryShipmentService {

  constructor(
    private router: Router,
    private store: SaleStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  upsertShipmentDelivery(shipping: Shipping, isDelivery: boolean): Observable<Shipping> {
    if (isDelivery) {
      return this.CarpetInventoryService.upsertDelivery(shipping).pipe(
        catchError(error => {
          console.error('Error on upserting shipment:', error)
          return EMPTY;
        }),
        tap((response: Shipping) => {
          this.messageService.success('Order Delivered Successfully');
        })
      )
    } 
    else {
      return this.CarpetInventoryService.upsertShipment(shipping).pipe(
        catchError(error => {
          console.error('Error on getting sales:', error)
          return EMPTY;
        }),
        tap((response: Shipping) => {
          // console.log({ response })
          let sale = this.store.getById(shipping.masterSaleId);
          sale!.tracking = {
            masterSaleId: shipping.masterSaleId,
            trackingNumber: shipping.trackingNumber,
            deliveryPartnerId: shipping.deliveryPartnerId,
            shipmentDate: new Date(),
            id: 0
          };
          this.messageService.success('Shipment Saved Successfully');
        })
      );
    }
  }
}
