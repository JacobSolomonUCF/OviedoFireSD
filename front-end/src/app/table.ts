import {Component, Input, ViewChild} from "@angular/core"
import {WebService} from "./services/webService";

@Component({
  selector: `item-table`,
  template: `
    <div [ngSwitch]="viewType">
      <ng-content select=".item-table-options-view" *ngSwitchCase="'view'"></ng-content>
      <ng-content select=".item-table-options-edit" *ngSwitchCase="'edit'"></ng-content>
      <ng-content select=".item-table-options-default" *ngSwitchDefault></ng-content>
    </div>
    <div [ngSwitch]="dataType">
      <ng-template ngSwitchCase="report">
        <div [ngSwitch]="viewType">
          <ngx-datatable
            #myTable
            class="table"
            [rows]="rows"
            [rowHeight]="'auto'"
            [columns]="heading"
            [columnMode]="'flex'"
            (select)="onclick()($event, table)"
            *ngSwitchCase="'view'"
            [selectionType]="'single'">
          </ngx-datatable>
          <div *ngSwitchCase="'edit'" class="tile pure-form pure-form-stacked editing">
            <fieldset>
              <div class="pure-g" style="letter-spacing: 0">
                <div class="pure-u-11-24 pure-u-sm-1">
                  <label for="title">Title</label>
                  <input #title id="title" type="text" [ngModel]="temp.name" (keyup)="keyup('title', title.value)">
                </div>

                <div class="pure-u-11-24 pure-u-sm-1">
                  <label for="type">Schedule</label>
                  <select #schedule id="type" [(ngModel)]="temp.schedule"
                          (change)="console.log(schedule); temp.schedule = schedule.state">
                    <option value="Daily">Daily</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
                <ng-template [ngIf]="temp.schedule && temp.schedule.length">
                  <div *ngIf="temp.schedule === 'Daily'" class="pure-u-11-24">
                    <label for="type">Truck</label>
                    <select id="type" [(ngModel)]="temp.base">
                      <option value="ATV 46">ATV 46</option>
                      <option value="Rescue 44">Rescue 44</option>
                    </select>
                  </div>
                  <div *ngIf="temp.schedule === 'Special'" class="pure-u-1">
                    special
                  </div>
                  <!--<div class="pure-u-11-24">-->
                    <!--<img src="https://api.qrserver.com/v1/create-qr-code/?data=ATV46ATVS&amp;size=100x100" alt="" title="" />-->
                  <!--</div>-->
                </ng-template>
              </div>
              <br/>
              <button type="submit" class="accept" [disabled]="true">Submit</button>
            </fieldset>
          </div>
          <div *ngSwitchDefault> default</div>
        </div>
      </ng-template>
      <ng-template ngSwitchCase="truck">
        <div [ngSwitch]="viewType">
          <ng-content select=".item-table-body-view" *ngSwitchCase="'view'"></ng-content>
          <ng-content select=".item-table-body-edit" *ngSwitchCase="'edit'"></ng-content>
          <ng-content select=".item-table-options-default" *ngSwitchDefault></ng-content>
        </div>
          
      </ng-template>
      <ng-template ngSwitchCase="user">
        <div [ngSwitch]="viewType">
          <ngx-datatable
            #myTable
            class="table"
            [rows]="rows"
            [rowHeight]="'auto'"
            [columns]="heading"
            [columnMode]="'flex'"
            (select)="onclick()($event, table)"
            *ngSwitchCase="'view'"
            [selectionType]="'single'">
          </ngx-datatable>
          <div *ngSwitchCase="'edit'" class="tile pure-form pure-form-stacked editing"
               style="height: calc(100vh - 250px)">
            <fieldset>
              <div class="pure-g" style="letter-spacing: 0">
                <div class="pure-u-11-24 pure-u-sm-1">
                  <label for="first-name">First Name</label>
                  <input #firstName id="first-name" type="text" [ngModel]="temp.firstName"
                         (keyup)="keyup('firstName', firstName.value)">
                </div>
                <div class="pure-u-11-24 pure-u-sm-1">
                  <label for="last-name">Last Name</label>
                  <input #lastName id="last-name" type="text" [ngModel]="temp.lastName"
                         (keyup)="keyup('lastName', lastName.value)">
                </div>
                <div class="pure-u-11-24 pure-u-sm-1">
                  <label for="email">Email</label>
                  <input #email id="email" type="text" [ngModel]="temp.email" (keyup)="keyup('email', email.value)">
                </div>

                <div class="pure-u-11-24 pure-u-sm-1">
                  <label for="type">Type</label>
                  <select #type id="type" [ngModel]="temp.type" (change)="temp.type = type.value">
                    <option>user</option>
                    <option>administrator</option>
                  </select>
                </div>
              </div>
              <br/>
              <button type="submit" class="accept"
                      [disabled]="loading || !(temp.firstName && temp.lastName && temp.type && temp.email)"
                      (click)="submit()">
                <i class="fa fa-spinner fa-spin" *ngIf="loading && !temp.original"></i>
                Submit
              </button>
              <button type="submit" class="accept" (click)="doDelete()" *ngIf="temp.original" [disabled]="loading">
                <i class="fa fa-spinner fa-spin" *ngIf="loading"></i>
                Delete
              </button>
            </fieldset>
          </div>
          <div *ngSwitchDefault> default</div>
        </div>
        <div *ngSwitchDefault> default</div>
      </ng-template>
      <ng-template ngSwitchDefault>
        <ngx-datatable
          #myTable
          *ngIf="!row"
          class='material expandable'
          [rows]="rows"
          [groupRowsBy]="style.group"
          [columnMode]="'force'"
          [scrollbarH]="false"
          [headerHeight]="50"
          [footerHeight]="0"
          [rowHeight]="'auto'"
          (select)="onclick()($event, myTable)"
          [selectionType]="style.selectType"
          [groupExpansionDefault]="true">
          <!-- Group Header Template -->
          <ngx-datatable-group-header [rowHeight]="'auto'" #myGroupHeader>
            <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
              <div style="padding-left:5px;"
                   (click)="toggleExpandGroup(group)">
              <span
                title="Expand/Collapse Group">
                <b><i class="fa {{expanded ? 'fa-chevron-down' : 'fa-chevron-right'}}" style="font-size: .7em"></i>&nbsp;{{group.value[0][style.group]}}</b>
              </span>
              </div>
            </ng-template>
          </ngx-datatable-group-header>
          <ngx-datatable-column [name]="style.thing"
                                [prop]="(style.thingProp) ? style.thingProp : style.thing"
                                [flexGrow]="3"></ngx-datatable-column>
          <ngx-datatable-column *ngFor="let x of style.days" [name]="x[0]" [prop]="x" [maxWidth]="75" [flexGrow]="1">
            <ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row"
                         let-group="group">
              <i class="fa {{getCheckBox(value)}}">{{getCheckBox(value) === '' ? value : ''}}</i>
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
  @ViewChild('datepicker') datepicker: any;
  @ViewChild('myTable') table: any;
  title: string = '';
  @Input() dataType: any;
  @Input() viewType: any;
  @Input() heading: any[];
  @Input() rows: any[];
  webService: WebService;
  loading: boolean = false;
  original: any;
  filter: any;
  date: string;
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
      group: 'status',
      days: [],
      thing: 'report',
      thingProp: 'name',
      props: [{name: 'schedule'}],
      select: (e, m) => {
        return this.onclick()(e, m);//this.openDialog(e, m);
      },
      selectType: 'single'
    },
    modal: {
      group: 'compartment',
      days: ['sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'],
      thing: 'item',
      props: [{name: 'Comment'}],
      select: () => {
      },
      selectType: 'single'
    }
  };
  style: any;
  previousStyle: any;

  constructor(webService: WebService) {
    this.webService = webService;
  }

  ngOnInit() {
    this.style = this.styles[this.viewType];
    this.original = this.rows;
  }

  getDate() {
    return (this.datepicker) ? this.datepicker.getDate() : '';
  }

  getTheme() {
    let options = {
      view: {
        reports: 'reports',
        other: this.dataType
      },
      other: this.viewType
    };

    return options[this.viewType] && options[this.viewType][this.dataType] || options.other;
  }

  keyup(index, value) {
    this.temp[index] = value;
  }

  submit() {
    if (!(this.temp.firstName && this.temp.lastName && this.temp.type && this.temp.email))
      return;

    if (this.temp.original)
      delete this.temp.original;
    else
      this.rows.push(this.temp);

    this.loading = true;
    this.webService.doPost('/users', {user: this.temp})
      .subscribe(() => {
          this.toggle()();
        }, () => {
          this.rows.splice(this.temp, 1);
        }, () => {
          this.loading = false;
        }
      );
  }

  doDelete() {
    this.loading = true;
    this.webService.doDelete('/users', {user: {email: this.temp.email}})
      .subscribe(() => {
        this.rows.splice(this.rows.indexOf(this.temp.original), 1);
        this.toggle()();
      }, () => {
      }, () => {
        this.loading = false;
      });
  }

  toggle() {
    let options = {
      edit: () => {
        delete this.temp;
        this.viewType = 'view';
      },
      ereport: () => {
        this.viewType = 'view';
        this.style = (this.previousStyle) ? this.previousStyle : this.style;
        this.table.rows = this.rows;
        this.title = '';
        delete this.previousStyle;
        delete this.temp;
        this.updateFilter(undefined);
      },
      other: () => { }
    };
    return options[this.viewType] || options.other;
  }

  updateFilter(event) {
    let val = "";
    const self = this;
    const source = self.temp ? self.temp :
      {rows: self.original, heading: self.heading};

    if (!event)
      this.filter = "";
    else
      val = event.target.value.toLowerCase();

    self.rows = source.rows.filter(row => {
      for (let i = 0, len = (!val ? 1 : source.heading.length); i < len; i++)
        if (val == '' || ("" + row[source.heading[i].prop]).toLowerCase().indexOf(val) !== -1)
          return true;
      return false;
    });
  }

  onclick() {
    let options = {
      reports: (event, m) => {
        if (this.viewType == 'ereport')
          return;
        this.viewType = 'ereport';
        this.filter = "";
        this.previousStyle = this.style;
        this.title = event.selected[0].name;
        m.rows = (this.temp = {
          rows: event.selected[0].data.rows,
          heading: event.selected[0].data.heading
        }).rows;
        this.style = this.styles.modal;
        this.style.report = event.selected[0].name;
      },
      user: (event) => {
        this.viewType = 'edit';
        this.temp = (event) ? event.selected[0] : {firstName: "", lastName: "", email: "", type: "user"};
        this.temp.original = event ? event.selected[0] : event;
      },
      report: (event) => {
        this.viewType = 'edit';
        this.temp = (event) ? event.selected[0] : {name: "", schedule: "Daily"};
      },
      truck: (event) => {
        this.viewType = 'edit';
        // this.temp = (event) ? event.selected[0] : {name: "", compartments: [{name: "", items: [{name: "", type: ""}]}]};
        this.temp = {
          rows: [
            {compartment: 'Cab', name: 'Mileage', type: 'num'},
            {compartment: 'Cab', name: 'Oil', type: 'per'}
            ],
          heading: [
            {prop: 'name', flexGrow: 1, name: 'Name'},
            {prop: 'type', flexGrow: 1, name: 'Type'}
          ]
        }
      },
      other: () => {
      }
    };
    return options[this.dataType] || options.other;
  }

  addCompartment(name = undefined) {
    if (name) {
      this.temp.rows.push({compartment: name, name: '', type: ''});
      this.temp.rows = [...this.temp.rows];
    }
  }

  remove(row) {
    for (let i = 0, len = this.temp.rows.length; i < len; i++) {
      if (this.temp.rows[i] === row) {
        this.temp.rows.splice(i, 1);
        this.temp.rows = [...this.temp.rows];
        return;
      }
    }
  }

  toggleExpandGroup(group, table = this.table) {
    table.groupHeader.toggleExpandGroup(group);
  }

  getCheckBox(status) {
    let options = {
      Present: 'fa-lg fa-check',
      okay: 'fa-lg fa-check-square box-okay',
      Missing: 'fa-lg fa-times box-missing',
      missing: 'fa-lg fa-check-square box-missing',
      "Repairs Needed": 'fa-lg fa-exclamation-triangle box-broken',
      broken: 'fa-lg fa-check-square box-broken',
      other: 'fa-minus'
    };

    return (options[status]) ? options[status] : (status.length) ? '' : options.other;
  }
}
