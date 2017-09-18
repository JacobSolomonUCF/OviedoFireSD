import {Component, Input, ViewChild} from "@angular/core"
import {MdDialog} from "@angular/material";
import {Modal} from "./modal/modal";

@Component({
  selector: `item-table`,
  template: `
    
    <div class="table-options">
      <div class="left">
        <button class="close" (click)="toggle()" *ngIf="previousStyle"> <i class="fa fa-chevron-left"></i> Back</button>
      </div>
      <div class="right">
        <input
        class='filter'
        type='text'
        placeholder='Type to filter...'
        (keyup)='updateFilter($event)'/>
      </div>
    </div>
    <!--<ngx-datatable>
      class="table expandable"
      [rows]="rows"
      [rowHeight]="600"
      [groupRowsBy]="'Compartment'"
      [groupExpansionDefault]="true"
      [columnMode]="'force'"
      (select)="openDialog($event)"
      [selectionType]="'single'"
      *ngIf="tableType == 'modal'"
    &gt;
      <ngx-datatable-group-header [rowHeight]="50" #myGroupHeader>
        <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
          <div style="padding-left:5px">
            <a
              href="#"
              title="Expand/Collapse Group">
              <b>Compartment: {{group.value[0].Compartment}}</b>
            </a>
          </div>
        </ng-template>
      </ngx-datatable-group-header>
      
      <ng-template ngFor="let h of heading" ngIf="h != 'Compartment'">

        <ngx-datatable-column prop="{{h}}">
          <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="rows"
                       let-group="group">
            {{rowIndex}}
          </ng-template>
        </ngx-datatable-column>
      </ng-template>
    </ngx-datatable>-->

    <!--<ngx-datatable-->
    <!--class="table"-->
    <!--[rows]="rows"-->
    <!--[rowHeight]="36"-->
    <!--[columns]="heading"-->
    <!--[columnMode]="'flex'"-->
    <!--(select)="openDialog($event)"-->
    <!--[selectionType]="'single'"></ngx-datatable>-->
    <!---->
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
      <!--<ngx-datatable-column name="Gender" prop="gender"></ngx-datatable-column>-->
      <!--<ngx-datatable-column name="Compartment" prop="compartment"></ngx-datatable-column>-->
      <ngx-datatable-column *ngFor="let x of style.props" [name]="x.name"[prop]="(x.prop) ? x.prop : x.name"
                            [flexGrow]="2">
      </ngx-datatable-column>
    </ngx-datatable>
  `
  , styleUrls: ['./table.sass']
})
export class Table {
  @ViewChild('myTable') table: any;
  @Input() heading: any[];
  @Input() rows: any[];
  @Input() tableType: any;
  original: any;
  temp: any[];
  row: any;

  styles = {
    view: {
      group: 'Status',
      days: [],
      thing: 'Report',
      thingProp: 'Name',
      props: [{name: 'Schedule'}],
      select: (e, m) => { return this.openDialog(e, m);},
      selectType: 'single'
    },
    modal: {
      group: 'Compartment',
      days: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
      thing: 'Item',
      props: [{name: 'Comment'}],
      select: () => {},
      selectType: 'single'
    }
  };
  style: any;
  previousStyle: any;

  constructor(public dialog: MdDialog) {}

  ngOnInit() {
    this.style = this.styles[this.tableType];
    this.original = this.rows;
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

  toggle() {
    this.table.rows = this.rows;
    this.style = (this.previousStyle) ? this.previousStyle : this.style;
    delete this.previousStyle;
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const self = this;

    self.rows = self.original.filter(function (row) {
      for (let i = 0, len = (!val ? 0 : self.heading.length); i < len; i++) {
        console.log(self.heading[i].prop);
        console.log(i, "'" + row[self.heading[i].prop].toLowerCase() + ",");
        if (row[self.heading[i].prop].toLowerCase().indexOf(val) !== -1)
          return true;
      }
      return false;
    });
  }

  openDialog(row, m) {
    if (this.tableType == 'modal') return;
    this.previousStyle = this.style;
    m.rows = row.selected[0].data.rows;
    console.log(this.rows);
    console.log(m.rows);
    this.style = this.styles.modal;
    // this.temp = row.selected[0];
    // const dialog = this.dialog.open(Modal, {
    //   data: {properties: this.heading, body: this.temp, footer: '', edit: this.tableType}
    // });
    // dialog.afterClosed().subscribe(
    //   resultPromise => {
    //     console.log(resultPromise);
    //   },
    //   () => {
    //     console.log('rejected');
    //   }
    // );
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }
}
