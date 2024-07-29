import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';

@Pipe({
  name: 'getOrderNoById'
})
export class GetOrderNoByIdPipe implements PipeTransform {
  constructor(
    private saleStoreService: SaleStoreService
  ) { }

  transform(saleId: number): Observable<string> {
    return this.saleStoreService.selectById(saleId).pipe(
      map((sale) => sale?.orderNumber ?? 'N/A')
    )
  }

}
