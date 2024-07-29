import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { CarpetInventoryHttpService } from '../../service/carpet-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';
import { FeedbackModel, feedbackSaveModel } from './feedback-form.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {

  constructor(
    private router: Router,
    private CarpetInventoryService: CarpetInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All Inventories list
  getAll(): Observable<FeedbackModel[]> {
    return this.CarpetInventoryService.getAllFeedbackQuestions().pipe(
      catchError(_error => {
        this.messageService.error('Error on getting feedback questions');
        return EMPTY;
      }),
      tap((records: FeedbackModel[]) => {
      })
    );
  }

  upsertFeedback(feedback: feedbackSaveModel): Observable<feedbackSaveModel> {

    return this.CarpetInventoryService.insertFeedback(feedback).pipe(
      catchError(_error => {
        this.messageService.error('Error on insert feedback question');
        return EMPTY;
      }),
      tap((response: feedbackSaveModel) => {
        this.messageService.success('Feedback Saved Successfully');
      })
    );
  }

  // insert and update Inventory
//   upsertInventory(inventory: InventoryModel): Observable<InventoryModel> {
//     if (inventory.id === 0) {
//       return this.CarpetInventoryService.insertInventory(inventory).pipe(
//         catchError(_error => {
//           this.messageService.error('Error on insert inventory');
//           return EMPTY;
//         }),
//         tap((response: InventoryModel) => {
//           this.store.upsertById(response);
//           console.log(response);
//           this.messageService.success('Inventory Inserted Successfully');
//         })
//       );
//     }
//     else {
//       return this.CarpetInventoryService.updateInventory(inventory).pipe(
//         catchError(_error => {
//           this.messageService.error('Error on update inventory');
//           return EMPTY;
//         }),
//         tap((response) => {
//           this.messageService.success('Inventory Updated Successfully');
//           console.log(response);
//           this.store.updateInventory(response);
//         })
//       );
//     }
//   }

//   // delete inventory
//   deleteInventory(inventory: InventoryModel): void {
//     this.CarpetInventoryService.deleteInventory(inventory).pipe(
//       catchError(_error => {
//         this.messageService.error('Error on delete inventory');
//         return EMPTY;
//       }),
//       tap((response: InventoryModel) => {
//         this.store.deleteById(inventory.id);
//         this.messageService.success('Inventory Deleted Successfully');
//       })
//     ).subscribe();
//   }

}
