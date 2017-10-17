import {Component, Input, ViewChild} from "@angular/core"
import {WebService} from "./services/webService";

@Component({
  selector: `item-table`,
  template: `
    <div class="table-options">
      <div class="left" [ngSwitch]="getTheme()">
        <button class="add" (click)="onclick()(undefined, table)" *ngSwitchCase="'view'">
          <i class="fa fa-plus"></i> Add {{dataType}}
        </button>
        <div *ngSwitchCase="'reports'">
          <datepicker #datepicker></datepicker>
        </div>
        <button class="close" (click)="toggle()()" *ngSwitchDefault>
          <i class="fa fa-chevron-left"></i> Back
        </button>
      </div>
      <div class="right" [ngSwitch]="viewType">
        <input
          #tableFilter
          class='filter'
          *ngIf="viewType != 'edit'"
          type='text'
          placeholder='Type to filter...'
          (keyup)='updateFilter($event)'/>
      </div>
    </div>
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
                  <select id="type" [ngModel]="temp.schedule">
                    <option>Daily</option>
                    <option>Special</option>
                  </select>
                </div>
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
          <ngx-datatable
            #myTable
            class="table"
            [rows]="rows"
            [rowHeight]="36"
            [columns]="heading"
            [columnMode]="'flex'"
            *ngSwitchCase="'view'"
            [selectionType]="'single'">
          </ngx-datatable>

          <div *ngSwitchDefault> default</div>
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
          [rowHeight]="40"
          (select)="onclick()($event, myTable)"
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
                <b><i class="fa {{expanded ? 'fa-chevron-down' : 'fa-chevron-right'}}" style="font-size: .7em"></i>&nbsp;{{style.group}}: {{style.report ? group.value[0][style.group].slice(style.report.length + 3) : group.value[0][style.group]}}</b>
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
  @ViewChild('datepicker') datepicker: any;
  @ViewChild('tableFilter') tableFilter: any;
  @ViewChild('myTable') table: any;
  @Input() dataType: any;
  @Input() viewType: any;
  @Input() heading: any[];
  @Input() rows: any[];
  webService: WebService;
  loading: boolean = false;
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
        truck: 'reports',
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
      this.tableFilter.nativeElement.value = "";
    else
      val = event.target.value.toLowerCase();

    self.rows = source.rows.filter(row => {
      for (let i = 0, len = (!val ? 1 : source.heading.length); i < len; i++)
        if (val == '' || (""+row[source.heading[i].prop]).toLowerCase().indexOf(val) !== -1)
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
        this.tableFilter.nativeElement.value = "";
        this.previousStyle = this.style;
        m.rows = (this.temp = {
          rows: event.selected[0].data.rows,
          heading: event.selected[0].data.heading
        }).rows;
        this.style = this.styles.modal;
        this.style.report = event.selected[0].name;
      },
      user: (event) => {
        this.viewType = 'edit';
        this.temp = (event === undefined) ? {firstName: "", lastName: "", email: "", type: "user"} : event.selected[0];
        this.temp.original = event ? event.selected[0] : event;
      },
      report: (event) => {
        this.viewType = 'edit';
        this.temp = (event === undefined) ? {name: "", schedule: "Daily"} : event.selected[0];
      },
      other: () => {}
    };
    return options[this.dataType] || options.other;
  }

  toggleExpandGroup(group) {
    this.table.groupHeader.toggleExpandGroup(group);
  }

  getCheckBox(status) {
    let options = {
      okay:    'fa-check-square box-okay',
      missing: 'fa-check-square box-missing',
      broken:  'fa-check-square box-broken',
      other:   ''
    };

    return options[status] || options.other;
  }
}
