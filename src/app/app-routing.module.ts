// Angular Import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';

// project import

const routes: Routes = [
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth/signin',
        pathMatch: 'full'
      },
      {
        path: 'auth/signup',
        loadComponent: () => import('./modules/authentication/sign-up/sign-up.component')
      },
      {
        path: 'auth/signin',
        loadComponent: () => import('./modules/authentication/sign-in/sign-in.component')
      }
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        loadChildren: () => import('./modules/User/user.module').then((m) => m.UserModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000'] }
      },
      {
        path: 'inventory',
        loadChildren: () => import('./modules/Inventory/inventory.module').then((m) => m.InventoryModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000','3000', '6000', '7000'] }
      },
      {
        path: 'purchase-voucher',
        loadChildren: () => import('./modules/Purchase-Voucher/purchase-voucher.module').then((m) => m.PurchaseVoucherModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000','3000', '6000', '7000'] }
      },
      // {
      //   path: 'purchase-voucher-detail',
      //   loadChildren: () => import('./modules/Purchase-Voucher/purchase-voucher.module').then((m) => m.PurchaseVoucherModule),
      //   canActivate: [authGuard],
      //   data: { expectedRole: ['1000','3000', '6000', '7000'] }
      // },
      {
        path: 'voucher',
        loadChildren: () => import('./modules/Voucher/voucher.module').then((m) => m.VoucherModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000','3000', '6000', '7000', '8000'] }
      },
      {
        path: 'sale',
        loadChildren: () => import('./modules/Sales/sales.module').then((m) => m.SaleModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000', '2000'] }
      },
      {
        path: 'custom-order',
        loadChildren: () => import('./modules/Custom-Order/custom-order.module').then((m) => m.CustomOrderModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000','3000', '6000', '7000'] }
      },
      {
        path: 'pending-payment',
        loadChildren: () => import('./modules/Pending-Payments/Pending-Payment.module').then((m) => m.PendingPaymentModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000','3000', '6000', '7000'] }
      },
      {
        path: 'link-sale',
        loadChildren: () => import('./modules/LInk Sale/link-sale.module').then((m) => m.LinkSaleModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000','3000', '6000', '7000'] }
      },
      {
        path: 'delivery-shipment',
        loadChildren: () => import('./modules/DeliveryShipment/delivery-shipment.module').then((m) => m.DeliveryShipmentModule),
        canActivate: [authGuard],
        data: { expectedRole: ['1000','3000', '6000', '7000'] }
      },
      {
        path: "analysis",
        loadChildren: () =>
          import("./modules/analysis/analysis.module").then(
            (m) => m.AnalysisModule
          ),
        canActivate: [authGuard],
        data: { expectedRole: ["1000"] },
      },

      {
        path: '**',
        redirectTo: 'users',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top', useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
