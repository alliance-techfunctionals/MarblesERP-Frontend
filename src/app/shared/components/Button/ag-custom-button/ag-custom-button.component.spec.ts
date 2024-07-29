import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgCustomButtonComponent } from './ag-custom-button.component';

describe('AgCustomButtonComponent', () => {
  let component: AgCustomButtonComponent;
  let fixture: ComponentFixture<AgCustomButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgCustomButtonComponent]
    });
    fixture = TestBed.createComponent(AgCustomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
