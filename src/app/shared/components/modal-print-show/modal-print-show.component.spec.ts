import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrintShowComponent } from './modal-print-show.component';

describe('ModalPrintShowComponent', () => {
  let component: ModalPrintShowComponent;
  let fixture: ComponentFixture<ModalPrintShowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPrintShowComponent]
    });
    fixture = TestBed.createComponent(ModalPrintShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
