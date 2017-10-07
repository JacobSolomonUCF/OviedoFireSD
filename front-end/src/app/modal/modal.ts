import {Component, Inject} from '@angular/core';
import {MD_DIALOG_DATA} from "@angular/material";


// TODO: destroy/replace
@Component({
  selector: 'modal',
  template: `
    <div class="modal-backdrop"></div>
    <div class="modal" [ngSwitch]="data.edit">
      <div class="modal-header">
        <div style="text-align: center">{{data.body[data.properties[0].prop]}}</div>
        <button md-dialog-close class="close"><i class="fa fa-times"></i></button>
      </div>
      <div class="modal-body {{data.edit}}">
        <ng-template [ngSwitchCase]="'edit'">
          <div *ngFor="let property of data.properties">
            <label *ngIf="property!=='ID'" style="text-transform: capitalize">{{property}}</label><br/>
            <input #i *ngIf="property!=='ID' && property!=='frequency'" [value]="data.body[property]"
                   style="margin-bottom: 2em" (blur)="temp[property] = i.value"/>
            <select *ngIf="property==='frequency'" style="margin-bottom: 1em">
              <option>Weekly</option>
              <option>Daily</option>
              <option>Custom</option>
            </select>
          </div>
        </ng-template>
        <ng-template [ngSwitchCase]="'view'">
          <item-table [heading]="data.body.data.heading" [rows]="data.body.data.rows"
                      [viewType]="'modal'"></item-table>
        </ng-template>
        <ng-template ngSwitchDefault>
          Unknown modal type.
        </ng-template>
      </div>
      <div class="modal-footer">
        <div>
          <button class="accept" *ngSwitchCase="'view'">Download</button>
          <button class="accept" *ngSwitchCase="'edit'" [md-dialog-close]="data.body">Accept</button>
          <button class="cancel" md-dialog-close>Cancel</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['modal.sass']
})
export class Modal {

  temp: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: any) {
    this.temp = {...data.body};
    //this.temp = data.body;
    // let reports = {
    //   name: 'string',
    //   frequency: [
    //     'actual frequency type',
    //     'other frequency',
    //     'other frequency'
    //   ],
    //   status: [
    //     'actual status',
    //     'status'
    //   ],
    //   schedule: [
    //     'mon','tue','wed','thur','fri','sat','sun'
    //   ],
    //   id: 'number'
    // };
  }
}
