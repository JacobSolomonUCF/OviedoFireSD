
import {Component} from "@angular/core"

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
  heading: any[] = ['First Name', 'Last Name', 'Shift', 'ID'];
  users: any[] = [
    {'First Name': "John",   'Last Name': "Doe",    'Shift': 'A', 'ID': 832},
    {'First Name': "Mary",   'Last Name': "Moe",    'Shift': 'A', 'ID': 829},
    {'First Name': "Joe",    'Last Name': "Dooley", 'Shift': 'B', 'ID': 928},
    {'First Name': "Johnny", 'Last Name': "Dooley", 'Shift': 'C', 'ID': 223}
  ];
}
