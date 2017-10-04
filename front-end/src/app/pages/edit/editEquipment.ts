import {Component} from "@angular/core";
import {WebService} from "../../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Edit Equipment</h1>
    </div>
    <div class="content">
      <item-table [heading]="heading" [rows]="reports" [tableType]="'edit'"></item-table>
    </div>
  `
  , styleUrls: ['../../menu.sass']
})
export class EditEquipment {
  activeModal: boolean = false;
  heading: any[] = [
    {prop: 'Name', flexGrow: 1, dragable: false, resizeable: true},
    {prop: 'Truck', flexGrow: 1, dragable: false, resizeable: true},
    {prop: 'Compartment', flexGrow: 1, dragable: false, resizeable: true},
    {prop: 'Condition', flexGrow: 1, dragable: false, resizeable: true},
    // {prop:'ID', flexGrow: 1, dragable: false, resizeable: true}
  ];
  reports: any[] = [
    {Name: "Bolt Cutters", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay', ID: '10012'},
    {Name: "SCBA Masks", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay', ID: '10014'},
    {Name: "Water Gear", Truck: "Rescue 44", Compartment: "Driver #2", Condition: 'Needs Repair', ID: '10015'},
    {Name: "Rescue Gear", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Missing', ID: '10012'},
    {Name: "Cooler", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay', ID: '10014'},
    {Name: "Stair Chair", Truck: "Rescue 44", Compartment: "Driver #2", Condition: 'Missing', ID: '10015'},
    {Name: "Bolt Cutters", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay', ID: '10012'},
    {Name: "SCBA Masks", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Broken', ID: '10014'},
    {Name: "Water Gear", Truck: "Rescue 44", Compartment: "Driver #2", Condition: 'Okay', ID: '10015'},
    {Name: "Rescue Gear", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay', ID: '10012'},
    {Name: "Cooler", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay', ID: '10014'},
    {Name: "Stair Chair", Truck: "Rescue 44", Compartment: "Driver #2", Condition: 'Missing', ID: '10015'},
    {Name: "Bolt Cutters", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Okay', ID: '10012'},
    {Name: "SCBA Masks", Truck: "Engine 44", Compartment: "Officer Side #2", Condition: 'Needs Repair', ID: '10014'},
    {Name: "Water Gear", Truck: "Rescue 44", Compartment: "Driver #2", Condition: 'Okay', ID: '10015'}
  ];

  constructor(webService: WebService) {
    webService.setState('eEquipment');
  }
}
