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
  `
  , styleUrls: ['../../menu.sass']
})
export class EditTruck {
  loading: boolean = true;
  heading: any[] = [
    {prop: 'Truck', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'Compartments', flexGrow: 1, dragable: false, resizeable: false},
    {prop: 'Equipment Count', flexGrow: 1, dragable: false, resizeable: false},
    // {prop: 'ID', flexGrow: 1, dragable: false, resizeable: false}
  ];
  reports: any[] = [
    {Truck: "Engine 44", Compartments: 20, 'Equipment Count': 43, ID: '10012'},
    {Truck: "ATV 44", Compartments: 2, 'Equipment Count': 6, ID: '10015'},
    {Truck: "Rescue 44", Compartments: 20, 'Equipment Count': 29, ID: '10012'}
  ];

  constructor(webService: WebService) {
    webService.setState('eTruck');

    this.loading = false;

  }
}
