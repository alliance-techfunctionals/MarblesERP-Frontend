import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PaymentStatusService{

  // payment status enum
  paymentStatus = {
    Unpaind: 0,
    PartialPayment: 1,
    Success: 7
  }

  // get payment status display name
  getPaymentStatusDisplayName(status: number): string {
    switch (status) {
      case this.paymentStatus.Unpaind:
        return 'Unpaid';
      case this.paymentStatus.PartialPayment:
        return 'Partial Payment';
      case this.paymentStatus.Success:
        return 'Success';
      default:
        return 'N/A';
    }
  }
}