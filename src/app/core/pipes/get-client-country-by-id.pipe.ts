import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserStoreService } from 'src/app/shared/store/user/user.store';

@Pipe({
  name: 'getClientCountryById'
})
export class GetClientCountryByIdPipe implements PipeTransform {
  constructor(
    private userStoreService: UserStoreService
  ) { }

  transform(userId: number): Observable<string> {
    return this.userStoreService.selectById(userId).pipe(
      map((user) => user?.country ?? 'N/A')
    )
  }

}
