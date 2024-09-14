import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, switchMap, take, tap } from 'rxjs/operators';
import { ArtisanStoreService } from './artisan.store';
import { Artisan, ArtisanResponse } from './artisan.model';
import { MarbleInventoryHttpService } from '../../service/marble-inventory.http.service';
import { MessageToastService } from 'src/app/core/service/message-toast.service';

@Injectable({ providedIn: 'root' })
export class ArtisanService {

  constructor(
    private router: Router,
    protected store: ArtisanStoreService,
    private CarpetInventoryService: MarbleInventoryHttpService,
    private messageService: MessageToastService
  ) { }

  // get All Artisan list
  getAll(): Observable<Artisan[]> {
    return this.store.selectHasCache().pipe(
      take(1),
      switchMap(hasCache => {
        const request = this.CarpetInventoryService.getAllArtisan().pipe(
          catchError(error => {
            if(error.status === 404){
              // this.messageService.success('Data Not Available');
              return EMPTY;
            }
            else{
              this.messageService.error('Error on getting artisan:', error);
              return EMPTY;
            }
          }),
          tap((records: ArtisanResponse[]) => {
            const mappedResult: Artisan[] = records.map((d) => ({
              name: d.name,
              id: d.id
            }));
            this.store.upsertArtisan(mappedResult);
          })
        );
        return hasCache ? of([]) : request;
      }), delay(0)
    );
  }

}
