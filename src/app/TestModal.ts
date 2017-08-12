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
  template: `
    <div class="modal-backdrop"></div>
    <div class="modal">
      <div class="modal-header">
        Test
        <button md-dialog-close class="close"><i class="fa fa-times"></i></button>
      </div>
      <div class="modal-body">
        Hi
      </div>
      
      <div class="modal-footer">
        <div>
          <button class="accept">Accept</button>
          <button class="cancel" md-dialog-close>Cancel</button>
        </div>
      </div>
    </div>`,
})
export class DialogOverviewExampleDialog {}
