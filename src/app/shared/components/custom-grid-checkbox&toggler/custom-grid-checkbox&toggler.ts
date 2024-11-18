import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-custom-cell-renderer',
  template: `
    <ng-container *ngIf="isParentRow(); else checkboxTemplate">
      <button (click)="toggleRow()" class="btn btn-link p-0">
        <i class="fa" [ngClass]="{'fa-chevron-right': !params.node.expanded, 'fa-chevron-down': params.node.expanded}"></i>
      </button>
    </ng-container>
    <ng-template #checkboxTemplate>
      <input type="checkbox" [checked]="params.node.selected" (change)="onCheckboxChange($event)" />
    </ng-template>
  `,
  styles: [`
    .btn-link {
      text-decoration: none;
    }
  `]
})
export class CustomCellRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: ICellRendererParams): void {
    // console.log(params);
    this.params = params
  }

  isParentRow(): boolean {
    return !!this.params.data.productCodeRange;
  }

  refresh(_params: ICellRendererParams): boolean {
    return true;
  }

  toggleRow(): void {
    this.params.node.setExpanded(!this.params.node.expanded);
    this.params.api.onGroupExpandedOrCollapsed();
  }

  onCheckboxChange(event: any): void {
    this.params.node.setSelected(event.target.checked);
  }
}