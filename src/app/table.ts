import {Component, Input} from "@angular/core"
import {MdDialog} from "@angular/material";
import {Modal} from "./modal/modal";

@Component({
  selector: `item-table`,
  template: `
    <div class="table">
      <table>
        <thead>
        <th *ngFor="let head of heading">
          <div>
            {{head}}
            <button class="fa fa-chevron-up"></button>
            <button class="fa fa-chevron-down"></button>
         </div>
        </th>
        </thead>
        <tbody>
        <tr *ngFor="let row of rows" (click)="openDialog()">
          <td *ngFor="let head of heading">
            <button *ngIf="head ==='ID' && this.editing">Save</button>
            <span *ngIf="!(head === 'ID' && this.editing)">{{row[head]}}</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>`
  , styleUrls: ['./table.sass']
})
export class Table {
  @Input() heading: string[];
  @Input() rows: any[];
  editing: boolean = false;

  constructor(public dialog: MdDialog) {}

  openDialog() {
    this.dialog.open(Modal);
  }
}
