import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map, of, switchMap } from 'rxjs';
import { PendingPaymentService } from 'src/app/shared/store/pending-payment/pending-payment.service';
import { PendingPaymentStoreService } from 'src/app/shared/store/pending-payment/pending-payment.store';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserStoreService } from 'src/app/shared/store/user/user.store';

@Pipe({
  name: 'getClientNameByPendingPaymentId'
})
export class GetClientNameByPendingPaymentIdPipe implements PipeTransform {
  constructor(
    private userStoreService: UserStoreService,
    private pendingPaymentStoreService: PendingPaymentStoreService
  ) { }

  transform(pendingPaymentId: number): Observable<string> {
    return this.pendingPaymentStoreService.selectById(pendingPaymentId).pipe(
        switchMap((payment) => {
          if (!payment) {
            return of('N/A');
          }
          const customerId = payment.customerId;
          return this.userStoreService.selectById(customerId).pipe(
            map((user) => user?.name ?? 'N/A')
          );
        })
      );
  }

}
