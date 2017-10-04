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

    <div [ngSwitch]="style">
      <div *ngSwitchCase="styles.edit">
        <ngx-datatable
          #myTable
          class="table"
          [rows]="rows"
          [rowHeight]="36"
          [columns]="heading"
          [columnMode]="'flex'"
          (select)="style.select"
          [selectionType]="'single'"></ngx-datatable>
      </div>
      <div *ngSwitchDefault>
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
      </div>
    </div>
  `
})
export class Table {
  @ViewChild('tableFilter') tableFilter: any;
  @ViewChild('myTable') table: any;
  @Input() tableType: any;
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
    this.style = this.styles[this.tableType];
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
