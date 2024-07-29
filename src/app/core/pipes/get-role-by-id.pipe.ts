import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';

@Pipe({
  name: 'getRoleById'
})
export class GetRoleByIdPipe implements PipeTransform {
  constructor(
    private roleStoreService: RoleStoreService
  ) { }

  transform(roleId: number): Observable<string> {
    return this.roleStoreService.selectById(roleId).pipe(
      map((roles) => roles?.role ?? 'N/A')
    )
  }

}
