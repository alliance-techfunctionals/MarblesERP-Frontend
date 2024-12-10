import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-grouping-panel',
  // standalone: true,
  template: `
    <div class="grouping-panel">
      <div
        class="group-item"
        *ngFor="let col of groupedColumns; let i = index"
        (dragstart)="onDragStart($event, col)"
        (dragover)="onDragOver($event, i)"
        (drop)="onDrop($event, i)"
        draggable="true"
      >
        <span>{{ col }}</span>
        <button (click)="removeGroup(col)">x</button>
      </div>
      <div class="add-column" (dragover)="allowDrop($event)" (drop)="addGroup($event)">
        Drag columns here to group
      </div>
    </div>
  `,
  styles: [
    `
      .grouping-panel {
        display: flex;
        gap: 10px;
        padding: 10px;
        border: 1px solid #ccc;
        background: #f9f9f9;
        margin-bottom: 10px;
      }
      .group-item {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        border: 1px solid #ccc;
        background: #fff;
        cursor: move;
      }
      .add-column {
        flex: 1;
        text-align: center;
        padding: 5px;
        border: 1px dashed #ccc;
        background: #f3f3f3;
      }
    `,
  ],
})
export class GroupingPanelComponent {
  @Input() groupedColumns: string[] = [];
  @Output() groupedColumnsChange = new EventEmitter<string[]>();

  private draggedCol: string | null = null;

  onDragStart(event: DragEvent, col: string) {
    this.draggedCol = col;
    event.dataTransfer?.setData('text/plain', col);
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const draggedCol = event.dataTransfer?.getData('text/plain');
    if (draggedCol && this.draggedCol) {
      const currentIdx = this.groupedColumns.indexOf(this.draggedCol);
      this.groupedColumns.splice(currentIdx, 1);
      this.groupedColumns.splice(index, 0, draggedCol);
      this.groupedColumnsChange.emit([...this.groupedColumns]);
    }
    this.draggedCol = null;
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  addGroup(event: DragEvent) {
    event.preventDefault();
    const col = event.dataTransfer?.getData('text/plain');
    if (col && !this.groupedColumns.includes(col)) {
      this.groupedColumns.push(col);
      this.groupedColumnsChange.emit([...this.groupedColumns]);
    }
  }

  removeGroup(col: string) {
    this.groupedColumns = this.groupedColumns.filter((c) => c !== col);
    this.groupedColumnsChange.emit([...this.groupedColumns]);
  }
}