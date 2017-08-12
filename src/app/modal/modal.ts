import {Component} from '@angular/core';

@Component({
  selector: 'modal',
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
export class Modal {}
