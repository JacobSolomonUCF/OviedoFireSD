import {Component, Input} from "@angular/core"
import {MdDialog} from "@angular/material";
import {Modal} from "./modal/modal";

@Component({
  selector: `item-table`,
  template: `
    <div class="table {{tableType}}-table">
      <table>
        <thead style="text-transform: capitalize">
          <th *ngFor="let head of heading">
            <div>
              {{head}}
              <button class="fa fa-chevron-up" *ngIf="tableType!='modal'"></button>
              <button class="fa fa-chevron-down" *ngIf="tableType!='modal'"></button>
           </div>
          </th>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows; let i = index" (click)="openDialog(row)">
            <td *ngFor="let head of heading">
              <span *ngIf="!(i!=0 && rows[i-1][heading[0]] == row[head] && heading[0] == head)">{{row[head]}}</span>
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
  @Input() tableType: any;
  editing: boolean = false;
  temp: any[];

  constructor(public dialog: MdDialog) {}

  openDialog(row) {
    if (this.tableType == 'modal') return;
    this.temp = row;
    const dialog = this.dialog.open(Modal, {
      data: {properties: this.heading, body: this.temp, footer: '', edit: this.tableType}
    });
    dialog.afterClosed().subscribe(
      resultPromise => { console.log(resultPromise); },
      () => { console.log('rejected'); }
    );
  }
}
