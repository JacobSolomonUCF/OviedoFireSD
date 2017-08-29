import {Component} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Reports</h1>
    </div>
    <div class="content">
      <item-table [heading]="heading" [rows]="reports" [tableType]="'edit'"></item-table>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class EditReport {
  heading: any[] = ['name','frequency','status','ID'];
  reports: any[];

  constructor(public webService: WebService) {
    let self = this;
    webService.get('/reports')
      .subscribe(resp => {
        self.reports = resp['reportsList'].map(function (x) {
          switch(x.schedule.length) {
            case 7:  x['frequency'] = 'Daily';  break;
            case 1:  x['frequency'] = 'Weekly'; break;
            case 0:  x['frequency'] = 'Error';  break;
            default: x['frequency'] = 'Custom'; break;
          }
          return x;
        })
      });
  }
}
