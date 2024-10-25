import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseVoucherDetailsComponent } from './purchase-voucher-details.component';

describe('PurchaseVoucherDetailsComponent', () => {
  let component: PurchaseVoucherDetailsComponent;
  let fixture: ComponentFixture<PurchaseVoucherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseVoucherDetailsComponent]
    });
    fixture = TestBed.createComponent(PurchaseVoucherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
