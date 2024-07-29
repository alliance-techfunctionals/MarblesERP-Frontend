import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderProgressDetailComponent } from './custom-order-progress-detail.component';

describe('CustomOrderProgressDetailComponent', () => {
  let component: CustomOrderProgressDetailComponent;
  let fixture: ComponentFixture<CustomOrderProgressDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomOrderProgressDetailComponent]
    });
    fixture = TestBed.createComponent(CustomOrderProgressDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
