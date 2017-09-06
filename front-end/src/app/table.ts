import {Component, Input} from "@angular/core"
import {MdDialog} from "@angular/material";
import {Modal} from "./modal/modal";

@Component({
  selector: `item-table`,
  template: `<ngx-datatable
        class="table"
        [rows]="rows"
        [rowHeight]="36"
        [columns]="heading"
        [columnMode]="'flex'"
        (select)="openDialog($event)"
        [selectionType]="'single'"></ngx-datatable>`
  , styleUrls: ['./table.sass']
})
export class Table {
  @Input() heading: string[];
  @Input() rows: any[];
  @Input() tableType: any;
  temp: any[];

  constructor(public dialog: MdDialog) {}

  openDialog(row) {
    if (this.tableType == 'modal') return;
    this.temp = row.selected[0];
    const dialog = this.dialog.open(Modal, {
      data: {properties: this.heading, body: this.temp, footer: '', edit: this.tableType}
    });
    dialog.afterClosed().subscribe(
      resultPromise => { console.log(resultPromise); },
      () => { console.log('rejected'); }
    );
  }
}
