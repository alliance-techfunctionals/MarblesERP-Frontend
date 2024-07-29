import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryShipmentComponent } from './delivery-shipment.component';

describe('DeliveryShipmentComponent', () => {
  let component: DeliveryShipmentComponent;
  let fixture: ComponentFixture<DeliveryShipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryShipmentComponent]
    });
    fixture = TestBed.createComponent(DeliveryShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
