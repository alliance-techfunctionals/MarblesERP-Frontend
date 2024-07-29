import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDialogBoxComponent } from './input-dialog-box.component';

describe('InputDialogBoxComponent', () => {
  let component: InputDialogBoxComponent;
  let fixture: ComponentFixture<InputDialogBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputDialogBoxComponent]
    });
    fixture = TestBed.createComponent(InputDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
