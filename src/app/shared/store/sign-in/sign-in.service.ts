import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { CarpetInventoryHttpService } from '../../service/carpet-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { SignInModel } from './sign-in.model';

@Injectable({ providedIn: 'root' })
export class SignInService {

  constructor(
    private CarpetInventoryService: CarpetInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All User list
  // getAll(): Observable<UserModel[]> {
  //   return this.store.selectHasCache().pipe(
  //     take(1),
  //     switchMap(hasCache => {
  //       const request = this.CarpetInventoryService.getAllUser().pipe(
  //         catchError(error => {
  //           this.messageService.error('Error on getting users:', error);
  //           return EMPTY;
  //         }),
  //         tap((records: UserModel[]) => {
  //           this.store.upsertUsers(records)
  //         })
  //       );
  //       return hasCache ? of([]) : request;
  //     }), delay(0)
  //   );
  // }

  // insert and update User
  upsertSignIn(user: SignInModel): Observable<String> {
    return this.CarpetInventoryService.signInUser(user).pipe(
      catchError(error => {
        if (error.status == 401){
          this.messageService.error('Invalid Mobile or Password')
          return EMPTY;
        }
        else{
          this.messageService.error('Error on User Sign In:', error);
          return EMPTY;
        }
        
      }),
      tap((response: String) => {
        this.messageService.success('Logged In Successfully');
      })
    );    
  }

  // delete user
  // deleteUser(user: UserModel): void {
  //   this.CarpetInventoryService.deleteUser(user).pipe(
  //     catchError(error => {
  //       this.messageService.error('Error on delete user:', error);
  //       return EMPTY;
  //     }),
  //     tap((_response: UserModel) => {
  //       this.store.deleteById(user.id);
  //       this.messageService.success('User Deleted Successfully');
  //     })
  //   ).subscribe();
  // }

}
