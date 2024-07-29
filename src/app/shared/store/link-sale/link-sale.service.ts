import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { CarpetInventoryHttpService } from '../../service/carpet-inventory.http.service';
import { LinkSale } from './link-sale.model';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class LinkSaleService {

  constructor(
    private router: Router,
    private CarpetInventoryService: CarpetInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  upsertLinkSale(sale: LinkSale): Observable<boolean> {
    return this.CarpetInventoryService.patchLinkSaleVoucher(sale).pipe(
      catchError(error => {
        this.messageService.error(error.error)
        return EMPTY;
      }),
      tap((response: boolean) => {
        this.messageService.success('Sale Linked Successfully');
      })
    );
  }

  deleteLinkSale(sale: LinkSale): Observable<boolean>{
    return this.CarpetInventoryService.deleteLinkSaleVoucher(sale).pipe(
      catchError(error => {
        this.messageService.error('Error on getting sales:')
        return EMPTY;
      }),
      tap((response: boolean) => {
        this.messageService.success('Link Deleted Successfully');
      })
    );
  }

}
