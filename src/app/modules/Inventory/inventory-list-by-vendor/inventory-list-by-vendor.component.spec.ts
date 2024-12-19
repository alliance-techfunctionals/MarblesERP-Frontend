import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryListByVendorComponent } from './inventory-list-by-vendor.component';

describe('InventoryListByVendorComponent', () => {
  let component: InventoryListByVendorComponent;
  let fixture: ComponentFixture<InventoryListByVendorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryListByVendorComponent]
    });
    fixture = TestBed.createComponent(InventoryListByVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
