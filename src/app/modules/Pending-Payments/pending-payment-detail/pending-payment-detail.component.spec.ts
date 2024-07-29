import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingPaymentDetailComponent } from './pending-payment-detail.component';

describe('PendingPaymentDetailComponent', () => {
  let component: PendingPaymentDetailComponent;
  let fixture: ComponentFixture<PendingPaymentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PendingPaymentDetailComponent]
    });
    fixture = TestBed.createComponent(PendingPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
