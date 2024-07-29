import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeliveryPartnerInputComponent } from './modal-delivery-partner-input.component';

describe('ModalDeliveryPartnerInputComponent', () => {
  let component: ModalDeliveryPartnerInputComponent;
  let fixture: ComponentFixture<ModalDeliveryPartnerInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDeliveryPartnerInputComponent]
    });
    fixture = TestBed.createComponent(ModalDeliveryPartnerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
