import {Component} from "@angular/core";

@Component({
  template: `
    <!--<modal *ngIf="activeModal"></modal>-->
    <div class="header">
      <h1>Edit Reports</h1>
    </div>
    <div class="content">
      <!--button (click)="activeModal = !activeModal">Toggle modal.</button-->
      <item-table [heading]="heading" [rows]="reports"></item-table>
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class EditReport {
  activeModal: boolean = false;
  heading: any[] = ['Name','Schedule','Status','ID'];
  reports: any[] = [
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012'},
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014'},
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015'},
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012'},
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014'},
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015'},
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012'},
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014'},
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015'},
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012'},
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014'},
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015'},
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012'},
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014'},
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015'}
  ];
}
