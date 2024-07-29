import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserStoreService } from 'src/app/shared/store/user/user.store';

@Pipe({
  name: 'getClientNameById'
})
export class GetClientNameByIdPipe implements PipeTransform {
  constructor(
    private userStoreService: UserStoreService
  ) { }

  transform(userId: number): Observable<string> {
    return this.userStoreService.selectById(userId).pipe(
      map((user) => user?.name ?? 'N/A')
    )
  }

}
