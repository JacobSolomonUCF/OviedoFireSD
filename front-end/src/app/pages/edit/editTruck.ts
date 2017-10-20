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
        <item-table #itemtable [heading]="heading" [rows]="reports" [viewType]="'view'" [dataType]="'truck'">
          <div class="item-table-options-view table-options">
            <button class="add" (click)="itemtable.onclick()(undefined, itemtable.table)">
              <i class="fa fa-plus"></i> Add truck
            </button>
            <div class="right">
              <input
                #tableFilter
                class='filter'
                type='text'
                placeholder='Type to filter...'
                (keyup)='itemtable.updateFilter($event)'/>
            </div>
          </div>
          <div class="item-table-options-edit table-options">
            <button class="close" (click)="itemtable.toggle()()">
              <i class="fa fa-chevron-left"></i> Back
            </button>
            <div class="right">
              <input #compartmentName ngModel="" placeholder="Compartment Name..."/>
              <button class="accept" (click)="itemtable.addCompartment(compartmentName.value)" [disabled]="!compartmentName.value">
                create
              </button>
            </div>
          </div>
          <div class="item-table-body-view">
            <ngx-datatable
              #myTable
              class="table material expandable"
              [rows]="itemtable.rows"
              [rowHeight]="'auto'"
              [columns]="itemtable.heading"
              [columnMode]="'flex'"
              [selectionType]="'single'">
            </ngx-datatable>
          </div>
          <div class="item-table-body-edit">
            <ngx-datatable
              #myTable
              [rows]="itemtable.temp?.rows"
              [rowHeight]="'auto'"
              [groupRowsBy]="'compartment'"
              [columnMode]="'force'"
              [scrollbarH]="false"
              [cssClasses]="[]"
              [groupExpansionDefault]="true">
              <ngx-datatable-group-header [rowHeight]="'auto'" #myGroupHeader>
                <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
                  <div style="padding-left:5px">
                    <span title="Expand/Collapse Group">
                      <b style="display: flex; justify-content: space-between; width: 100%">
                        <span (click)="itemtable.toggleExpandGroup(group, myTable)">
                          <i class="fa {{expanded ? 'fa-chevron-down' : 'fa-chevron-right'}}" style="font-size: .7em"></i>
                          &nbsp;{{group.value[0].compartment}}
                        </span>
                        <button class="close" (click)="itemtable.addCompartment(group.value[0].compartment)"><i class="fa fa-plus"></i>&nbsp;Add</button>
                      </b>
                    </span>
                  </div>
                </ng-template>
              </ngx-datatable-group-header>
              <ngx-datatable-column [name]="'Name'" [prop]="'name'" [flexGrow]="2">
                <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row" class="example-full-width">
                  <input
                  (blur)="updateValue($event, 'name', rowIndex)"
                  type="text"
                  [value]="value"
                  />
                  </ng-template>
              </ngx-datatable-column>
              <ngx-datatable-column [name]="'Type'" [prop]="'type'" [flexGrow]="1">
                <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row">
                  <div style="display: flex; justify-content: space-between;">
                    <select
                      id="type"
                      (change)="updateValue($event, 'gender', rowIndex)"
                      [value]="value">
                      <option value="pmr">Present/Missing/Repair</option>
                      <option value="num">Number</option>
                      <option value="per">Percent</option>
                    </select>
                    <button class="close" (click)="itemtable.remove(row)"><i class="fa fa-times"></i></button>
                  </div>
                </ng-template>
              </ngx-datatable-column>
            </ngx-datatable>
          </div>
        </item-table>
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

  updateValue(a, b, c) {

  }

  foo(x) {
    console.log('foo', x);
  }

  constructor(webService: WebService) {
    webService.setState('eTruck');
    this.loading = false;
  }
}
