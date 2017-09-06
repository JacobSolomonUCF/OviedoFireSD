import {Component, Input, ViewChild} from "@angular/core"
import {MdDialog} from "@angular/material";
import {Modal} from "./modal/modal";

@Component({
  selector: `item-table`,
  template: `
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
      class='material expandable'
      [rows]="rows"
      [groupRowsBy]="style.group"
      [columnMode]="'force'"
      [scrollbarH]="true"
      [headerHeight]="50"
      [footerHeight]="50"
      [rowHeight]="40"
      (select)="style.select($event)"
      [selectionType]="style.selectType"
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
                <b>{{style.group}}: {{group.value[0][style.group]}}</b>
              </span>
          </div>
        </ng-template>
      </ngx-datatable-group-header>
      <ngx-datatable-column [name]="style.thing"
                            [prop]="(style.thingProp) ? style.thingProp : style.thing"></ngx-datatable-column>
      <ngx-datatable-column *ngFor="let x of style.days" [name]="x" [prop]="x">
        <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
                     let-group="group">
          <i class="fa {{getCheckBox(value)}}"></i>
        </ng-template>
      </ngx-datatable-column>
      <!--<ngx-datatable-column name="Gender" prop="gender"></ngx-datatable-column>-->
      <!--<ngx-datatable-column name="Compartment" prop="compartment"></ngx-datatable-column>-->
      <ngx-datatable-column *ngFor="let x of style.props" [name]="x.name"
                            [prop]="(x.prop) ? x.prop : x.name"></ngx-datatable-column>
    </ngx-datatable>

  `
  , styleUrls: ['./table.sass']
})
export class Table {
  @ViewChild('myTable') table: any;
  @Input() heading: string[];
  @Input() rows: any[];
  @Input() tableType: any;
  temp: any[];

  styles = {
    view: {
      group: 'Status',
      days: [],
      thing: 'Report',
      thingProp: 'Name',
      props: [{name: 'Schedule'}],
      select: (e) => { return this.openDialog(e);},
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

  constructor(public dialog: MdDialog) {}

  ngOnInit() {
    this.style = this.styles[this.tableType];
    console.log(this.style);
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

  openDialog(row) {
    console.log(row);
    if (this.tableType == 'modal') return;
    this.temp = row.selected[0];
    const dialog = this.dialog.open(Modal, {
      data: {properties: this.heading, body: this.temp, footer: '', edit: this.tableType}
    });
    dialog.afterClosed().subscribe(
      resultPromise => {
        console.log(resultPromise);
      },
      () => {
        console.log('rejected');
      }
    );
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }
}
