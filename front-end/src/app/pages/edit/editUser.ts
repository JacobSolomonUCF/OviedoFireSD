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
        <item-table [heading]="heading" [rows]="users" [tableType]="'edit'" *ngSwitchDefault></item-table>
      </div>
    </div>
  `
})
export class EditUser {
  loading: any = true;
  heading: any[] = [
    {prop: 'firstName', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'lastName', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'email', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'type', flexGrow: 1, dragable: false, resizable: false}
    // {prop: 'ID', flexGrow: 1, dragable: false, resizeable: false}
  ];
  users: any[];

  constructor(webService: WebService) {
    webService.setState('eUser')
      .get('/users')
      .subscribe(resp => {
        this.users = resp['list'];
      }, error => {
        this.users = undefined;
      }, () => {
        this.loading = false;
      });
  }
}
