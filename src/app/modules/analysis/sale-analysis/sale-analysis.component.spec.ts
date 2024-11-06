import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleAnalysisComponent } from './sale-analysis.component';

describe('SaleAnalysisComponent', () => {
  let component: SaleAnalysisComponent;
  let fixture: ComponentFixture<SaleAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleAnalysisComponent]
    });
    fixture = TestBed.createComponent(SaleAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
