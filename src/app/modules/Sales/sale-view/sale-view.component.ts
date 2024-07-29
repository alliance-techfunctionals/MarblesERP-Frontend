import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription, tap } from 'rxjs';
import { RoleService } from 'src/app/shared/store/role/role.service';
import { SaleModel } from 'src/app/shared/store/sales/sale.model';
import { SaleService } from 'src/app/shared/store/sales/sale.service';
import { SaleStoreService } from 'src/app/shared/store/sales/sale.store';
import { UserService } from 'src/app/shared/store/user/user.service';
import { VoucherService } from 'src/app/shared/store/voucher/voucher.service';

@Component({
  selector: 'app-sale-view',
  templateUrl: './sale-view.component.html',
  styleUrls: ['./sale-view.component.scss']
})
export default class SaleViewComponent  implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  
  sale: SaleModel | undefined;
  constructor(
    private saleService: SaleService,
    private userService: UserService,
    private roleService: RoleService,
    private voucherService: VoucherService,
    private saleServiceStore: SaleStoreService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest([
        this.route.params,
        this.saleService.getAll(),
        this.userService.getAll(),
        this.roleService.getAll(),
        this.voucherService.getAll(),
      ]).pipe(
        tap(([params]) => {
          this.sale = this.saleServiceStore.getById(params['id']);
        }
      )).subscribe()
    );
  }

  getTotalAmount(): number {
    return this.sale?.details.reduce((acc, product) => acc + product.amount, 0) || 0;
  }

  getPartPaidAmt(): number {
    return this.sale?.partPayment.reduce((acc, payment) => acc + payment.amount, 0) || 0;
  }

  ngOnDestroy(): void {
  }
}
