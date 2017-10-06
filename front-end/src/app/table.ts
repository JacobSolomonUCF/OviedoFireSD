import {Component, Input, ViewChild} from "@angular/core"
import {MdDialog} from "@angular/material";

@Component({
  selector: `item-table`,
  template: `
    <div class="table-options">
      <div class="left">
        <button class="close" (click)="toggle()" *ngIf="previousStyle"><i class="fa fa-chevron-left"></i> Back</button>
      </div>
      <div class="right">
        <input
          #tableFilter
          class='filter'
          type='text'
          placeholder='Type to filter...'
          (keyup)='updateFilter($event)'/>
      </div>
    </div>

    
    <!-- group/data [ reports, trucks, users, ereports] -->
    <div [ngSwitch]="dataType">
      <ng-template ngSwitchCase="report">
        <div [ngSwitch]="viewType">
          <ngx-datatable
            #myTable
            class="table"
            [rows]="rows"
            [rowHeight]="36"
            [columns]="heading"
            [columnMode]="'flex'"
            *ngSwitchCase="'edit'"
            [selectionType]="'single'">
          </ngx-datatable>
          <div *ngSwitchDefault> default </div>
        </div>
      </ng-template>
      <ng-template ngSwitchCase="truck">
        <div [ngSwitch]="viewType">
          <ngx-datatable
            #myTable
            class="table"
            [rows]="rows"
            [rowHeight]="36"
            [columns]="heading"
            [columnMode]="'flex'"
            *ngSwitchCase="'edit'"
            [selectionType]="'single'">
          </ngx-datatable>
          <div *ngSwitchDefault> default </div>
        </div>
      </ng-template>
      <ng-template ngSwitchCase="user">
        <div [ngSwitch]="viewType">
          <ngx-datatable
            #myTable
            class="table"
            [rows]="rows"
            [rowHeight]="36"
            [columns]="heading"
            [columnMode]="'flex'"
            (select)="userSelect($event, table)"
            *ngSwitchCase="'view'"
            [selectionType]="'single'">
          </ngx-datatable>
          <div *ngSwitchCase="'edit'" class="tile pure-form pure-form-stacked editing" style="height: calc(100vh - 250px)">
              <fieldset>
                <legend>{{temp.firstName + ' ' + temp.lastName}} </legend>

                <div class="pure-g" style="letter-spacing: 0">
                  <div class="pure-u-11-24 pure-u-sm-1">
                    <label for="first-name">First Name</label>
                    <input id="first-name" type="text" [ngModel]="temp.firstName">
                  </div>
                  <div class="pure-u-11-24 pure-u-sm-1">
                    <label for="last-name">Last Name</label>
                    <input id="last-name" type="text" [ngModel]="temp.lastName">
                  </div>
                  <div class="pure-u-11-24 pure-u-sm-1">
                    <label for="email">Email</label>
                    <input id="email" type="text" [ngModel]="temp.email">
                  </div>

                  <div class="pure-u-11-24 pure-u-sm-1">
                    <label for="type">Type</label>
                    <select id="type" [ngModel]="temp.type">
                      <option>user</option>
                      <option>administrator</option>
                    </select>
                  </div>

                  <!--<div class="pure-u-1 pure-u-md-1-3">-->
                    <!--<label for="last-name">Last Name</label>-->
                    <!--<input id="last-name" class="pure-u-23-24" type="text" [ngModel]="temp.lastName">-->
                  <!--</div>-->

                  <!--<div class="pure-u-1 pure-u-md-1-3">-->
                    <!--<label for="email">E-Mail</label>-->
                    <!--<input id="email" class="pure-u-23-24" type="email" [ngModel]="temp.email">-->
                  <!--</div>-->

                  <!--<div class="pure-u-1 pure-u-md-1-3">-->
                    <!--<label for="state">State</label>-->
                    <!--<select id="state" class="pure-input-1-2">-->
                      <!--<option>AL</option>-->
                      <!--<option>CA</option>-->
                      <!--<option>IL</option>-->
                    <!--</select>-->
                  <!--</div>-->
                </div>
                
                <button type="submit" class="pure-button pure-button-primary">Submit</button>
              </fieldset>
          </div>
          <div *ngSwitchDefault> default </div>
        </div>
        <div *ngSwitchDefault> default </div>
      </ng-template>
      
      <ng-template ngSwitchDefault="">
        <ngx-datatable
          #myTable
          *ngIf="!row"
          class='material expandable'
          [rows]="rows"
          [groupRowsBy]="style.group"
          [columnMode]="'flex'"
          [scrollbarH]="false"
          [headerHeight]="50"
          [footerHeight]="0"
          [rowHeight]="40"
          (select)="style.select($event, myTable)"
          [cssClasses]="[]"
          [selectionType]="style.selectType"
          [groupExpansionDefault]="true">
          <!-- Group Header Template -->
          <ngx-datatable-group-header [rowHeight]="50" #myGroupHeader>
            <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
              <div style="padding-left:5px;"
                   (click)="toggleExpandGroup(group)">
              <span
                title="Expand/Collapse Group">
                <b><i class="fa {{expanded ? 'fa-chevron-down' : 'fa-chevron-right'}}" style="font-size: .7em"></i>&nbsp;{{style.group}}: {{group.value[0][style.group]}}</b>
              </span>
              </div>
            </ng-template>
          </ngx-datatable-group-header>
          <ngx-datatable-column [name]="style.thing"
                                [prop]="(style.thingProp) ? style.thingProp : style.thing"
                                [flexGrow]="3"></ngx-datatable-column>
          <ngx-datatable-column *ngFor="let x of style.days" [name]="x" [prop]="x" [maxWidth]="100" [flexGrow]="1">
            <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
                         let-group="group">
              <i class="fa {{getCheckBox(value)}}"></i>
            </ng-template>
          </ngx-datatable-column>
          <ngx-datatable-column *ngFor="let x of style.props" [name]="x.name" [prop]="(x.prop) ? x.prop : x.name"
                                [flexGrow]="2">
          </ngx-datatable-column>
        </ngx-datatable>
      </ng-template>
    </div>
  `
})
export class Table {
  @ViewChild('tableFilter') tableFilter: any;
  @ViewChild('myTable') table: any;
  @Input() dataType: any;
  @Input() viewType: any;
  @Input() heading: any[];
  @Input() rows: any[];
  original: any;
  temp: any;
  row: any;

  styles = {
    edit: {
      group: false,
      days: [],
      thing: undefined,
      thingProp: undefined,
      props: [],
      select: () => {
      },
      selectType: 'single'
    },
    view: {
      group: 'Status',
      days: [],
      thing: 'Report',
      thingProp: 'Name',
      props: [{name: 'Schedule'}],
      select: (e, m) => {
        return this.openDialog(e, m);
      },
      selectType: 'single'
    },
    modal: {
      group: 'Compartment',
      days: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
      thing: 'Item',
      props: [{name: 'Comment'}],
      select: () => {
      },
      selectType: 'single'
    }
  };
  style: any;
  previousStyle: any;

  constructor(public dialog: MdDialog) {
  }

  ngOnInit() {
    this.style = this.styles[this.viewType];
    this.original = this.rows;
  }

  toggle() {
    this.style = (this.previousStyle) ? this.previousStyle : this.style;
    this.table.rows = this.rows;
    delete this.previousStyle;
    delete this.temp;
    this.updateFilter(undefined);
  }

  updateFilter(event) {
    let val = "";
    const self = this;
    const source = self.temp ? self.temp :
      {rows: self.original, heading: self.heading};

    if (!event)
      this.tableFilter.nativeElement.value = "";
    else
      val = event.target.value.toLowerCase();

    self.rows = source.rows.filter(row => {
      for (let i = 0, len = (!val ? 1 : source.heading.length); i < len; i++)
        if (row[source.heading[i].prop].toLowerCase().indexOf(val) !== -1 || val == '')
          return true;
      return false;
    });
  }

  openDialog(row, m) {
    this.tableFilter.nativeElement.value = "";
    this.previousStyle = this.style;
    m.rows = (this.temp = {
      rows: row.selected[0].data.rows,
      heading: row.selected[0].data.heading
    }).rows;
    this.style = this.styles.modal;
  }

  userSelect(event, m) {
    this.viewType = 'edit';
    console.log(event);
    this.temp = event.selected[0];
    console.log(m);
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
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

}
