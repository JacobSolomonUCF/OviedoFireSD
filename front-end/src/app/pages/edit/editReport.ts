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
        <item-table #itemtable [heading]="heading" [rows]="reports" [viewType]="'view'" [dataType]="'report'">
          <div class="item-table-options-view table-options">
            <div class="left">
              <button class="add" (click)="itemtable.onclick()(undefined, itemtable.table)">
                <i class="fa fa-plus"></i> Add report
              </button>
            </div>
            <div class="right">
              <input
                #tableFilter
                class='filter'
                type='text'
                [ngModel]="filter"
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
  , styleUrls: ['../../menu.sass']
})
export class EditReport {
  loading: boolean = true;
  heading: any[] = [
    {prop: 'name', flexGrow: 3, dragable: false, resizeable: true},
    {prop: 'schedule', flexGrow: 1, dragable: false, resizeable: true},
    // {prop: 'status', flexGrow: 1, dragable: false, resizeable: true},
    // {prop:'ID', flexGrow: 1, dragable: false, resizeable: true}
  ];
  reports: any[];

  constructor(public webService: WebService) {
    let self = this;

    webService.setState('eReport')
      .doGet('/listReports')
      .subscribe(resp => {
        self.reports = resp['list'].map(report => {
          if (report.interval.frequency === 'Daily')
            for (let i = 0, len = report.template.subSections.length; i < len; i++)
              if (report.template.subSections[i].title.indexOf(report.template.title) !== -1)
                report.template.subSections[i].title = report.template.subSections[i].title.substring(report.template.title.length + 3);
          return report
        });
        }, () => {
          self.loading = false;
        }, () => {
          self.loading = false;
        }
      );
  }
}
