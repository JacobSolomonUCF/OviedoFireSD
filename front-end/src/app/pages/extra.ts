import {Component, ViewChild} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
  template: `
    <div class="header">
      <h1>Extras</h1>
    </div>

    <div class="content">
      <!-- Report view style. -->
      <!--<ng-template class="report-view">
        <ngx-datatable
          #myTable
          class='material expandable'
          [rows]="rows"
          [groupRowsBy]="'compartment'"
          [columnMode]="'force'"
          [scrollbarH]="true"
          [headerHeight]="50"
          [footerHeight]="50"
          [rowHeight]="40"
          [groupExpansionDefault]="true">
          &lt;!&ndash; Group Header Template &ndash;&gt;
          <ngx-datatable-group-header [rowHeight]="50" #myGroupHeader>
            <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
              <div style="padding-left:5px;"
                   (click)="toggleExpandGroup(group)">
              <span
                [class.datatable-icon-right]="!expanded"
                [class.datatable-icon-down]="expanded"
                title="Expand/Collapse Group">
                <b>Compartment: {{group.value[0].compartment}}</b>
              </span>
              </div>
            </ng-template>
          </ngx-datatable-group-header>
          &lt;!&ndash; Row Column Template &ndash;&gt;
          <ngx-datatable-column name="Condition." prop="" editable="true">
            <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
                         let-group="group">

              <i class="fa {{row.exppayyes===1 ? 'fa-check-square box-okay' : 'fa-square-o'}}"></i>
              <i class="fa {{row.exppayno===1  ? 'fa-check-square box-repair' : 'fa-square-o'}}"></i>
              <i class="fa {{row.exppaypending===1 ? 'fa-check-square box-missing' : 'fa-square-o'}}"></i>
              <i
                class="fa {{row.exppayyes + row.exppayno + row.exppaypending === 0 ? 'fa-check-square box-broken' : 'fa-square-o'}}"></i>
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column name="Item" prop="name"></ngx-datatable-column>
          &lt;!&ndash;<ngx-datatable-column name="Gender" prop="gender"></ngx-datatable-column>&ndash;&gt;
          &lt;!&ndash;<ngx-datatable-column name="Compartment" prop="compartment"></ngx-datatable-column>&ndash;&gt;
          <ngx-datatable-column name="Comment" prop="comment">
            <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
                         let-group="group" let-rowHeight="rowHeight">
            <span type="text"
                  name="comment">{{value}}</span>
            </ng-template>
          </ngx-datatable-column>
        </ngx-datatable>
      </ng-template>-->
      <!--<ng-template class="report-week-view">-->
        <ngx-datatable
          #myTable
          class='material expandable'
          [rows]="rows"
          [groupRowsBy]="'Compartment'"
          [columnMode]="'force'"
          [scrollbarH]="true"
          [headerHeight]="50"
          [footerHeight]="50"
          [rowHeight]="40"
          (select)="foo($event)"
          [selectionType]="'single'"
          [groupExpansionDefault]="true">
          <!-- Group Header Template -->
          <ngx-datatable-group-header [rowHeight]="50" #myGroupHeader>
            <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
              <div style="padding-left:5px;"
                   (click)="toggleExpandGroup(group)">
              <span
                [class.datatable-icon-right]="!expanded"
                [class.datatable-icon-down]="expanded"
                title="Expand/Collapse Group">
                <b>Compartment: {{group.value[0].Compartment}}</b>
              </span>
              </div>
            </ng-template>
          </ngx-datatable-group-header>
          <ngx-datatable-column name="Item" prop="Item"></ngx-datatable-column>
          <ngx-datatable-column *ngFor="let x of days" [name]="x" [prop]="x">
            <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
                         let-group="group">
              <i class="fa {{getCheckBox(value)}}"></i>
            </ng-template>
          </ngx-datatable-column>
          <!--<ngx-datatable-column name="Gender" prop="gender"></ngx-datatable-column>-->
          <!--<ngx-datatable-column name="Compartment" prop="compartment"></ngx-datatable-column>-->
          <ngx-datatable-column name="Comment" prop="comment">
            <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
                         let-group="group" let-rowHeight="rowHeight">
            <span type="text"
                  name="comment">{{value}}</span>
            </ng-template>
          </ngx-datatable-column>
        </ngx-datatable>
      <!--</ng-template>-->
    </div>
  `
  , styleUrls: ['../menu.sass']
})
export class Extra {

  @ViewChild('myTable') table: any;
  editing: any;
  rows = [
    {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #1",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #1",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #1",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #2",    Item: "Map",    Sun: "Okay",    Mon: 'Repair', Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #3",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #3",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #3",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #3",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #3",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #3",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #4",    Item: "Map",    Sun: "Okay",    Mon: 'Repair', Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #4",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #4",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #4",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #4",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #4",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #5",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #5",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #5",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #5",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #5",    Item: "Map",    Sun: "Okay",    Mon: 'Repair', Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #5",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #6",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #6",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #6",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #6",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #6",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #6",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #7",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #7",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #7",    Item: "Map",    Sun: "Okay",    Mon: 'Repair', Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #7",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #7",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #7",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #8",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #8",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #8",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #8",    Item: "Horn",   Sun: "Okay",    Mon: 'Okay',   Tues: 'Okay',   Wed: 'Broken', Thur: 'Okay',   Fri: 'Broken', Sat: 'Okay'},
    {Compartment: "Driver #9",    Item: "Lights", Sun: "Repair",  Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Repair', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #9",    Item: "Bells",  Sun: "Missing", Mon: 'Okay',   Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #9",    Item: "Map",    Sun: "Okay",    Mon: 'Repair', Tues: 'Okay',   Wed: 'Repair', Thur: 'Okay',   Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #9",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #9",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'},
    {Compartment: "Driver #9",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'}
  ];

  days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

  foo(e) {
    console.log('test', e);
  }

  getCheckBox(status) {
    switch (status) {
      case 'Okay':
        return 'fa-check-square box-okay';
      case 'Repair':
        return 'fa-check-square box-repair';
      case 'Missing':
        return 'fa-check-square box-missing';
      case 'Broken':
        return 'fa-check-square box-broken';
      default:
        return 'fa-square-o'
    }
  }

  constructor(webService: WebService) {
    webService.setState('extras');
  }

  getGroupRowHeight(group, rowHeight) {
    let style = {};

    style = {
      height: (group.length * 40) + 'px',
      width: '100%'
    };

    return style;
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }
}
