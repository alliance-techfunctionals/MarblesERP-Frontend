import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { UserModel } from './user.model';
import { UserStoreService } from './user.store';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(
    protected store: UserStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All User list
  getAll(): Observable<UserModel[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllUser().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on getting users:', error);
              return EMPTY;
            }
          }),
          tap((records: UserModel[]) => {
            this.store.upsertUsers(records)
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

  // insert and update User
  upsertUser(user: UserModel): Observable<UserModel> {
    if (user.id === 0) {
      return this.CarpetInventoryService.insertUser(user).pipe(
        catchError(error => {
          this.messageService.error('Error on insert user:', error.error.message);
          return EMPTY;
        }),
        tap((response: UserModel) => {
          this.messageService.success('User Saved Successfully');
          this.store.upsertById(response);
        })
      );
    }
    else {
      return this.CarpetInventoryService.updateUser(user).pipe(
        catchError(error => {
          this.messageService.error('Error on update user:', error.error.message);
          return EMPTY;
        }),
        tap((response) => {
          this.messageService.success('User Updated Successfully');
          this.store.updateUser(response);
        })
      );
    }
  }

  // delete user
  deleteUser(user: UserModel): void {
    this.CarpetInventoryService.deleteUser(user).pipe(
      catchError(error => {
        this.messageService.error('Error on delete user:', error);
        return EMPTY;
      }),
      tap((_response: UserModel) => {
        this.store.deleteById(user.id);
        this.messageService.success('User Deleted Successfully');
      })
    ).subscribe();
  }

}
