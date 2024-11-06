import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgCustomDropdownComponent } from './ag-custom-dropdown.component';

describe('AgCustomDropdownComponent', () => {
  let component: AgCustomDropdownComponent;
  let fixture: ComponentFixture<AgCustomDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgCustomDropdownComponent]
    });
    fixture = TestBed.createComponent(AgCustomDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
