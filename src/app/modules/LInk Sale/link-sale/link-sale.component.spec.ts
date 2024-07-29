import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSaleComponent } from './link-sale.component';

describe('LinkSaleComponent', () => {
  let component: LinkSaleComponent;
  let fixture: ComponentFixture<LinkSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkSaleComponent]
    });
    fixture = TestBed.createComponent(LinkSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
