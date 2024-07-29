import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { VoucherStoreService } from 'src/app/shared/store/voucher/voucher.store';

@Pipe({
  name: 'getVoucherNoById'
})
export class GetVoucherNoByIdPipe implements PipeTransform {
  constructor(
    private voucherStoreService: VoucherStoreService
  ) { }

  transform(voucherId: number): Observable<string> {
    return this.voucherStoreService.selectById(voucherId).pipe(
      map((voucher) => voucher?.voucherCode ? voucher.voucherCode : 'N/A')
    )
  }

}
