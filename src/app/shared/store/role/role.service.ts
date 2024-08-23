import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { RoleStoreService } from './role.store';
import { Role } from './role.model';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(
    private router: Router,
    protected store: RoleStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All User list
  getAll(): Observable<Role[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllRole().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on Getting Role:', error);
              return EMPTY;
            }
          }),
          tap((records: Role[]) => {
            this.store.upsertRoles(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

}
