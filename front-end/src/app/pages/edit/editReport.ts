import {Component} from "@angular/core";
import {WebService} from "../../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Reports</h1>
    </div>
    <div class="content">
      <item-table [heading]="heading" [rows]="reports" [tableType]="'edit'"></item-table>
    </div>
  `
  , styleUrls: ['../../menu.sass']
})
export class EditReport {
  heading: any[] = [
    {prop:'name', flexGrow: 1, resizeable: true},
    {prop:'schedule', flexGrow: 1, resizeable: true},
    {prop:'status', flexGrow: 1, resizeable: true},
    // {prop:'ID', flexGrow: 1, resizeable: true}
  ];
  reports: any[];

  constructor(public webService: WebService) {
    let self = this;

    webService.setState('eReport');

    webService.get('/reports')
      .subscribe(resp => {
        self.reports = resp['reportsList'];
      });
  }
}
