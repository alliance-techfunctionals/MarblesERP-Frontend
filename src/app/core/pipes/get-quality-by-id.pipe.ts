import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { QualityStoreService } from 'src/app/shared/store/quality/quality.store';
import { RoleStoreService } from 'src/app/shared/store/role/role.store';

@Pipe({
  name: 'getQualityById'
})
export class GetQualityByIdPipe implements PipeTransform {
  constructor(
    private qualityStoreService: QualityStoreService
  ) { }

  transform(qualityId: number): Observable<string> {
    return this.qualityStoreService.selectById(qualityId).pipe(
      map((quality) => quality?.name ?? 'N/A')
    )
  }

}
