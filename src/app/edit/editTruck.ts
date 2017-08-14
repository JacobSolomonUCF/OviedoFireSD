import {Component} from "@angular/core";

@Component({
  template: `
    <div class="header">
      <h1>Edit Trucks</h1>
    </div>
    <div class="content">
      <item-table [heading]="heading" [rows]="reports"></item-table>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class EditTruck {
  activeModal: boolean = false;
  heading: any[] = ['Truck','Compartments','Equipment Count','ID'];
  reports: any[] = [
    {Truck: "Engine 44", Compartments: 20, 'Equipment Count': 43, ID: '10012'},
    {Truck: "ATV 44",    Compartments: 2,  'Equipment Count': 6,  ID: '10015'},
    {Truck: "Rescue 44", Compartments: 20, 'Equipment Count': 29, ID: '10012'}
  ];
}
