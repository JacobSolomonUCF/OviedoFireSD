import {Component} from "@angular/core";
import {WebService} from "../../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Trucks</h1>
    </div>
    <div class="content">
      <item-table [heading]="heading" [rows]="reports" [tableType]="'edit'"></item-table>
    </div>
  `
  , styleUrls: ['../../menu.sass']
})
export class EditTruck {
  activeModal: boolean = false;
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
  }
}
