import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderProgressListComponent } from './custom-order-progress-list.component';

describe('CustomOrderProgressListComponent', () => {
  let component: CustomOrderProgressListComponent;
  let fixture: ComponentFixture<CustomOrderProgressListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomOrderProgressListComponent]
    });
    fixture = TestBed.createComponent(CustomOrderProgressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
