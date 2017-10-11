import {Component} from "@angular/core";
import {WebService} from "../../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Trucks</h1>
    </div>
    <div class="content" [ngSwitch]="loading">
      <div *ngSwitchCase="true" class="centered">
        <i class="fa fa-5x fa-spinner fa-pulse"></i>
      </div>
      <div *ngSwitchCase="false" [ngSwitch]="reports">
        <div *ngSwitchCase="undefined">Nothing here</div>
        <item-table [heading]="heading" [rows]="reports" [viewType]="'view'" [dataType]="'truck'"></item-table>
      </div>
    </div>
  `
  , styleUrls: ['../../menu.sass']
})
export class EditTruck {
  loading: boolean = true;
  heading: any[] = [
    {prop: 'truck', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'compartments', flexGrow: 1, dragable: false, resizeable: false, number: true},
    {prop: 'Equipment Count', flexGrow: 1, dragable: false, resizeable: false, number: true},
    // {prop: 'ID', flexGrow: 1, dragable: false, resizeable: false}
  ];
  reports: any[] = [
    {truck: "Engine 44", compartments: 20, 'Equipment Count': 43, id: '10012'},
    {truck: "ATV 44", compartments: 2, 'Equipment Count': 6, id: '10015'},
    {truck: "Rescue 44", compartments: 20, 'Equipment Count': 29, id: '10012'}
  ];

  constructor(webService: WebService) {
    webService.setState('eTruck');

    this.loading = false;

  }
}
