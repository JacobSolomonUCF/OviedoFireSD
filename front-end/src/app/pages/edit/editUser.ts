
import {Component} from "@angular/core"
import {WebService} from "../../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Users</h1>
    </div>
    <div class="content">
      <item-table [heading]="heading" [rows]="users" [tableType]="'edit'"></item-table>
    </div>
  `
})
export class EditUser {
  heading: any[] = [
    {prop: 'First Name', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'Last Name', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'Shift', flexGrow: 1, dragable: false, resizeable: false},
    // {prop: 'ID', flexGrow: 1, dragable: false, resizeable: false}
  ];
  users: any[] = [
    {'First Name': "John",   'Last Name': "Doe",    Shift: 'A', ID: 832},
    {'First Name': "Mary",   'Last Name': "Moe",    Shift: 'A', ID: 829},
    {'First Name': "Joe",    'Last Name': "Dooley", Shift: 'B', ID: 928},
    {'First Name': "Johnny", 'Last Name': "Dooley", Shift: 'C', ID: 223}
  ];

  constructor(webService: WebService) {
    webService.setState('eUser');
  }
}
