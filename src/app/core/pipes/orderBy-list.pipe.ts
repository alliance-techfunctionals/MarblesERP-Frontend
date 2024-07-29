import { Pipe, PipeTransform } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserModel } from 'src/app/shared/store/user/user.model';
import { UserStoreService } from 'src/app/shared/store/user/user.store';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  constructor(
    private userStoreService: UserStoreService
  ) { }

  transform(array: UserModel[], order?: string, sortBy?: string): UserModel[] {
    const sortOrder = order ? order : 'asc'; // Set default ascending order
    return sortOrder === 'asc'? array.sort((a,b) => a.id - b.id) : array.sort((a,b) => b.id - a.id);
}

}
