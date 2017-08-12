import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'modal',
  template: `
    <div class="modal-backdrop"></div>
    <div class="modal">
      <div class="modal-header">
        {{data.body[data.properties[0]]}}
        <button md-dialog-close class="close"><i class="fa fa-times"></i></button>
      </div>
      <div class="modal-body" *ngFor="let property of data.properties">
        <label *ngIf="property!=='ID'">{{property}}</label><br/>
        <input *ngIf="property!=='ID'" [value]="data.body[property]" />
        {{data.body[property]}}
      </div>
      <div class="modal-footer">
        <div>
          <button class="accept">Accept</button>
          <button class="cancel" md-dialog-close>Cancel</button>
        </div>
      </div>
    </div>
  `,
})
export class Modal {
  constructor(@Inject(MD_DIALOG_DATA) public data: any) {}
}
