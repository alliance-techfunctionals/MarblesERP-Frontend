import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserStoreService } from 'src/app/shared/store/user/user.store';

@Pipe({
  name: 'getUserByRoleId'
})
export class GetUserByRoleIdPipe implements PipeTransform {
  constructor(
    private userStoreService: UserStoreService
  ) { }

  transform(roleId: number): Observable<string> {
    return this.userStoreService.selectById(roleId).pipe(
      map((roles) => roles?.name ?? 'N/A')
    )
  }

}
