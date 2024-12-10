import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSaleTypeConfirmComponent } from './modal-sale-type-confirm.component';

describe('ModalSaleTypeConfirmComponent', () => {
  let component: ModalSaleTypeConfirmComponent;
  let fixture: ComponentFixture<ModalSaleTypeConfirmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSaleTypeConfirmComponent]
    });
    fixture = TestBed.createComponent(ModalSaleTypeConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
