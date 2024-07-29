import { NgModule } from '@angular/core';
import { GetRoleByIdPipe } from './get-role-by-id.pipe';
import { GetUserByRoleIdPipe } from './get-user-by-role-id.pipe';
import { GetQualityByIdPipe } from './get-quality-by-id.pipe';
import { GetDesignByIdPipe } from './get-design-by-id.pipe';
import { OrderByPipe } from './orderBy-list.pipe';
import { GetOrderNoByIdPipe } from './get-orderNo-by-id.pipe';
import { GetClientNameByIdPipe } from './get-client-name-by-id.pipe';
import { GetVoucherNoByIdPipe } from './get-voucher-no-by-id.pipe';
import { SortDescendingPipe } from './sort-descending-list.pipe';
import { GetClientNameByPendingPaymentIdPipe } from './get-client-name-by-pending-payment-id.pipe';
import { GetClientNumberByIdPipe } from './get-client-number-by-id.pipe';
import { GetClientCountryByIdPipe } from './get-client-country-by-id.pipe';
import { GetNumberToWordsPipe } from './get-words-from-num.pipe';

@NgModule({
  declarations: [
    GetRoleByIdPipe,
    GetUserByRoleIdPipe,
    GetQualityByIdPipe,
    GetDesignByIdPipe,
    OrderByPipe,
    GetOrderNoByIdPipe,
    GetClientNameByIdPipe,
    GetVoucherNoByIdPipe,
    SortDescendingPipe,
    GetClientNameByPendingPaymentIdPipe,
    GetClientNumberByIdPipe,
    GetClientCountryByIdPipe,
    GetNumberToWordsPipe
  ],
  exports: [
    GetRoleByIdPipe,
    GetUserByRoleIdPipe,
    GetQualityByIdPipe,
    GetDesignByIdPipe,
    OrderByPipe,
    GetOrderNoByIdPipe,
    GetClientNameByIdPipe,
    GetVoucherNoByIdPipe,
    SortDescendingPipe,
    GetClientNameByPendingPaymentIdPipe,
    GetClientNumberByIdPipe,
    GetClientCountryByIdPipe,
    GetNumberToWordsPipe
  ],

})
export class PipesModule { }
