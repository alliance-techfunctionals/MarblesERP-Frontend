import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDialogBoxComponent } from './message-dialog-box.component';

describe('MessageDialogBoxComponent', () => {
  let component: MessageDialogBoxComponent;
  let fixture: ComponentFixture<MessageDialogBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MessageDialogBoxComponent]
    });
    fixture = TestBed.createComponent(MessageDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
