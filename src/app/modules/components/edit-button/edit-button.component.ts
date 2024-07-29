import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-edit-button',
  standalone: true,
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent implements ICellRendererAngularComp {
  @Input() userId: number = 0;
  @Output() deleteClicked = new EventEmitter<number>(); 
  agInit(params: ICellRendererParams): void {}
  refresh(params: ICellRendererParams): boolean {
    return true;
  }
  onEditClick() {
    alert("Mission Launched");
  }

  onDeleteClick() {
    alert(this.userId);
    this.deleteClicked.emit(this.userId); // Emit the delete event
  }
}
