import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class OrderStatusService{

  // order status enum
  orderStatus = {
    UnderProcess: 5,
    ToBeShipped: 6,
    UnderShipment: 7,
    Delivered: 8,
  }

  // get order status display name
  getOrderStatusDisplayName(status: number): string {
    switch (status) {
      case this.orderStatus.Delivered:
        return 'Delivered';
      case this.orderStatus.ToBeShipped:
        return 'To Be Shipped';
      case this.orderStatus.UnderProcess:
        return 'Under Process';
      case this.orderStatus.UnderShipment:
        return 'Under Shipment';
      default:
        return 'N/A';
    }
  }
}