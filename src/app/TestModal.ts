import {Component} from '@angular/core';
import {MdDialog} from '@angular/material';


@Component({
  selector: 'dialog-overview-example',
  template: '<p><button md-button (click)="openDialog()">Open dialog</button></p>',
})
export class DialogOverviewExample {
  constructor(public dialog: MdDialog) {}

  openDialog() {
    this.dialog.open(DialogOverviewExampleDialog);
  }
}


@Component({
  selector: 'dialog-overview-example-dialog',
  template: '<div class="modal-backdrop"></div><div class="modal"><div class="modal-header">Test</div><p>Hi</p></div>',
})
export class DialogOverviewExampleDialog {}
