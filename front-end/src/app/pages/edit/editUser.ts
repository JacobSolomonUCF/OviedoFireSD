import {Component} from "@angular/core"
import {WebService} from "../../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Users</h1>
    </div>
    <div class="content" [ngSwitch]="loading">
      <div *ngSwitchCase="true" class="centered">
        <i class="fa fa-5x fa-spinner fa-pulse"></i>
      </div>
      <div *ngSwitchCase="false" [ngSwitch]="users">
        <div *ngSwitchCase="undefined">Nothing here</div>
        <item-table #itemtable [heading]="heading" [rows]="users" [viewType]="'view'" [dataType]="'user'" *ngSwitchDefault>
          <div class="item-table-options-view table-options">
            <div class="left">
              <button class="add" (click)="itemtable.onclick()(undefined, itemtable.table)">
                <i class="fa fa-plus"></i> Add user
              </button>
            </div>
            <div class="right">
              <input
                #tableFilter
                class='filter'
                type='text'
                placeholder='Type to filter...'
                (keyup)='itemtable.updateFilter($event)'/>
            </div>
          </div>
          <div class="item-table-options-edit table-options">
            <button class="close" (click)="itemtable.toggle()()">
              <i class="fa fa-chevron-left"></i> Back
            </button>
          </div>
        </item-table>
      </div>
    </div>
  `
})
export class EditUser {
  loading: any = true;
  heading: any[] = [
    {prop: 'firstName', flexGrow: 3, dragable: false, resizeable: false, style: 'text'},
    {prop: 'lastName', flexGrow: 3, dragable: false, resizeable: false, style: 'text'},
    {prop: 'email', flexGrow: 3, dragable: false, resizeable: false, style: 'text'},
    {prop: 'type', flexGrow: 2, dragable: false, resizable: false, style: 'dropdown'},
    {prop: 'alert', flexGrow: 1, dragable: false, resizable: false, style: 'check'}
    // {prop: 'ID', flexGrow: 1, dragable: false, resizeable: false}
  ];
  users: any[];

  constructor(webService: WebService) {
    webService.setState('eUser')
      .doGet('/users')
      .subscribe(resp => {
        this.users = resp['list'];
      }, () => {
        this.users = undefined;
      }, () => {
        this.loading = false;
      });
  }
}
