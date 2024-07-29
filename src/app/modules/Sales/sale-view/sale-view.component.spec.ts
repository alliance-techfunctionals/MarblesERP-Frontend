import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleViewComponent } from './sale-view.component';

describe('SaleViewComponent', () => {
  let component: SaleViewComponent;
  let fixture: ComponentFixture<SaleViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleViewComponent]
    });
    fixture = TestBed.createComponent(SaleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
