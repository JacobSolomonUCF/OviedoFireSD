import {Component, Input, ViewChild} from "@angular/core"
import {WebService} from "./services/webService";

@Component({
  selector: `item-table`,
  templateUrl: 'table.html'
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
  editing = [];
  selected = [];
  original: any;
  filter: any;
  date: string;
  temp: any = {};
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

  updateValue(a, b, c) {

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
        this.temp = (event) ? event.selected[0] : {firstName: "", lastName: "", email: "", alert: false, type: "user"};
        this.temp.original = event ? event.selected[0] : event;
      },
      report: (event) => {
        if (this.viewType === 'view') {
          this.viewType = 'edit';
          this.temp = (event) ? event.selected[0] : {template: {subSections: []}, interval: {frequency: ""}};
          this.selected = (this.temp.template.subSections) ? [this.temp.template.subSections[0]] : [this.temp.template];
        } else if (this.viewType === 'edit') {
          this.selected = event.selected;
        }
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

  addSection() {
    this.temp.template.subSections.push({title: "", inputElements: []})
  }

  add() {
    this.selected[0].inputElements.push({caption: "", type: ""},);
    // this.selected[0].inputElements = [...this.selected[0].inputElements];
  }

  remove(row) {
    if (this.dataType === 'report') {
      this.selected[0].inputElements.splice(row, 1);
      // this.selected[0] = [...this.selected[0]];
    } else
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
