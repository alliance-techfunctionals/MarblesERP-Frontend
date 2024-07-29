import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DesignStoreService } from 'src/app/shared/store/design/design.store';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';

@Pipe({
  name: 'getDesignById'
})
export class GetDesignByIdPipe implements PipeTransform {
  constructor(
    private designStoreService: DesignStoreService
  ) { }

  transform(designId: number): Observable<string> {
    return this.designStoreService.selectById(designId).pipe(
      map((design) => design?.name ?? 'N/A')
    )
  }

}
