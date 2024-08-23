import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { Invoice } from './invoice.model';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class InvoiceService {

  constructor(
    private router: Router,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  upsertInvoice(invoice: Invoice): Observable<Invoice> {
      return this.CarpetInventoryService.getInvoice(invoice).pipe(
        catchError(error => {
          console.error('Error on Getting Invoice:', error)
          return EMPTY;
        }),
        tap((response: Invoice) => {
          if(invoice.invoiceType !== 2){
            this.messageService.success('E-mail Sent Successfully');
          }
        })
      );
    }

    printInvoice(saleId: number): Observable<Invoice> {
      return this.CarpetInventoryService.printInvoice(saleId).pipe(
        catchError(error => {
          if(error.status === 204){
            this.messageService.error('No Invoice Found');
          }
          else{
            this.messageService.error('Error on Getting Invoice:', error.error.message);
          }
          return EMPTY;
        }),
        tap((response: Invoice) => {
          if(!response){
            // getting null when there is no inovice found
            this.messageService.error('No Invoice Found');
          }
        })
      );
    }

}
