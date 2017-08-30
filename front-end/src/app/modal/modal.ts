import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'modal',
  template: `
    <div class="modal-backdrop"></div>
    <div class="modal" [ngSwitch]="data.edit">
      <div class="modal-header">
        <div style="text-align: center">{{data.body[data.properties[0]]}}</div>
        <button md-dialog-close class="close"><i class="fa fa-times"></i></button>
      </div>
      <div class="modal-body {{data.edit}}">
        <ng-template [ngSwitchCase]="'edit'">
          <div *ngFor="let property of data.properties">
            <label *ngIf="property!=='ID'">{{property}}</label><br/>
            <input *ngIf="property!=='ID'" [value]="data.body[property]" style="margin-bottom: 2em"/>
          </div>
        </ng-template>
        <ng-template [ngSwitchCase]="'view'">
          <item-table [heading]="data.body.data.heading" [rows]="data.body.data.rows" [tableType]="'modal'"></item-table>
        </ng-template>
        <ng-template ngSwitchDefault>
          Unknown modal type.
        </ng-template>
      </div>
      <div class="modal-footer">
        <div>
          <button class="accept" *ngSwitchCase="'view'">Download</button>
          <button class="accept" *ngSwitchCase="'edit'">Accept</button>
          <button class="cancel" md-dialog-close>Cancel</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['modal.sass']
})
export class Modal {
  constructor(@Inject(MD_DIALOG_DATA) public data: any) {}
}
