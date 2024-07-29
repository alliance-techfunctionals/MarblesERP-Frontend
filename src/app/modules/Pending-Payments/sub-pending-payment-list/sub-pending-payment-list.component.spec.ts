import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubPendingPaymentListComponent } from './sub-pending-payment-list.component';

describe('SubPendingPaymentListComponent', () => {
  let component: SubPendingPaymentListComponent;
  let fixture: ComponentFixture<SubPendingPaymentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubPendingPaymentListComponent]
    });
    fixture = TestBed.createComponent(SubPendingPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
