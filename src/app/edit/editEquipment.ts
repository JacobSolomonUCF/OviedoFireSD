import {Component} from "@angular/core";

@Component({
  template: `
    <div class="header">
      <h1>Edit Equipment</h1>
    </div>
    <div class="content">
      <item-table [heading]="heading" [rows]="reports"></item-table>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class EditEquipment {
  activeModal: boolean = false;
  heading: any[] = ['Name','Truck','Compartment','Condition','ID'];
  reports: any[] = [
    {Name: "Bolt Cutters", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay',         ID: '10012'},
    {Name: "SCBA Masks",   Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay',         ID: '10014'},
    {Name: "Water Gear",   Truck: "Rescue 44", Compartment: "Driver #2",       Condition: 'Needs Repair', ID: '10015'},
    {Name: "Rescue Gear",  Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Missing',      ID: '10012'},
    {Name: "Cooler",       Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay',         ID: '10014'},
    {Name: "Stair Chair",  Truck: "Rescue 44", Compartment: "Driver #2",       Condition: 'Missing',      ID: '10015'},
    {Name: "Bolt Cutters", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay',         ID: '10012'},
    {Name: "SCBA Masks",   Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Broken',       ID: '10014'},
    {Name: "Water Gear",   Truck: "Rescue 44", Compartment: "Driver #2",       Condition: 'Okay',         ID: '10015'},
    {Name: "Rescue Gear",  Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay',         ID: '10012'},
    {Name: "Cooler",       Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay',         ID: '10014'},
    {Name: "Stair Chair",  Truck: "Rescue 44", Compartment: "Driver #2",       Condition: 'Missing',      ID: '10015'},
    {Name: "Bolt Cutters", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay',         ID: '10012'},
    {Name: "SCBA Masks",   Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Needs Repair', ID: '10014'},
    {Name: "Water Gear",   Truck: "Rescue 44", Compartment: "Driver #2",       Condition: 'Okay',         ID: '10015'}
  ];
}
