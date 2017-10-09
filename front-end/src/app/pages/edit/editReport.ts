import {Component} from "@angular/core";
import {WebService} from "../../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Reports</h1>
    </div>
    <div class="content" [ngSwitch]="loading">
      <div *ngSwitchCase="true" class="centered">
        <i class="fa fa-5x fa-spinner fa-pulse"></i>
      </div>
      <div *ngSwitchCase="false">
        <item-table [heading]="heading" [rows]="reports" [viewType]="'view'" [dataType]="'report'"></item-table>
      </div>
    </div>
  `
  , styleUrls: ['../../menu.sass']
})
export class EditReport {
  loading: boolean = true;
  heading: any[] = [
    {prop: 'name', flexGrow: 3, dragable: false, resizeable: true},
    {prop: 'schedule', flexGrow: 1, dragable: false, resizeable: true},
    {prop: 'status', flexGrow: 1, dragable: false, resizeable: true},
    // {prop:'ID', flexGrow: 1, dragable: false, resizeable: true}
  ];
  reports: any[];

  constructor(public webService: WebService) {
    let self = this;

    webService.setState('eReport')
      .get('/reports')
      .subscribe(resp => {
          self.reports = resp['reportsList'];
        }, () => {
        }, () => {
          self.loading = false;
        }
      );
  }
}
