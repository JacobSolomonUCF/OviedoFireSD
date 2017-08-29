import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule}           from '@angular/platform-browser';
import {Component, NgModule}     from '@angular/core';
import {MdDialogModule}          from '@angular/material';
import {FormsModule}             from '@angular/forms';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database'
import {AngularFireAuthModule} from 'angularfire2/auth'

import {UIRouterModule} from '@uirouter/angular';
import {AppComponent}   from './app.component';

import {Table}         from './table';
import {Modal}         from './modal/modal';
import {EditUser}      from './edit/editUser';
import {EditReport}    from './edit/editReport';
import {EditTruck}     from './edit/editTruck';
import {EditEquipment} from './edit/editEquipment';

import { ChartsModule } from "ng2-charts/ng2-charts";

// Initialize Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyDiF2EZj3ljA0Jrwafuq67de4ptk1r_usE",
  authDomain: "oviedofiresd-55a71.firebaseapp.com",
  databaseURL: "https://oviedofiresd-55a71.firebaseio.com",
  //projectId: "oviedofiresd-55a71",
  storageBucket: "oviedofiresd-55a71.appspot.com",
  messagingSenderId: "514772607400"
};

@Component({
  template: `
    <div>
      <div class="header">
        <h1>Home</h1>
      </div>

      <div class="content">
        <!-- top tiles -->
        <div class="row tile_count">
          <div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
            <span class="count_top"><i class="fa fa-user"></i> Total Users</span>
            <div class="count">7</div>

          </div>
          <div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
            <span class="count_top"><i class="fa fa-wrench"></i> Equipment </span>
            <div class="count">123</div>

          </div>
          <div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
            <span class="count_top"><i class="glyphicon glyphicon-list-alt"></i> Total Reports</span>
            <div class="count green">7</div>

          </div>
          <div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
            <span class="count_top"><i class="fa fa-tasks"></i> Reports todo</span>
            <div style="font-size: 2em;">3</div>
          </div>
        </div>
        <!-- /top tiles -->

        <!--<div class="row">-->
        <!--<div class="col-md-12 col-sm-12 col-xs-12">-->
        <!--<div class="dashboard_graph">-->
        <!--<div class="row x_title">-->
        <!--<div class="col-md-6">-->
        <!--<h3> Home </h3>-->
        <!--</div>-->

        <!--</div>-->
        <!--</div>-->
        <!--</div>-->

        <!--</div>-->
        <br>

        <div class="row">
          <div class="pure-u-2-5 tile">
            <div class="tile-head">
              <h3 class="pure-u-4-5">To Do List</h3>
              <ul class="pure-u-1-5 options">
                <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                </li>
                <li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i
                    class="fa fa-wrench"></i></a>
                  <ul class="dropdown-menu" role="menu">
                  </ul>
                </li>
                <li><a class="close-link"><i class="fa fa-close"></i></a>
                </li>
              </ul>
            </div>
            <ul class="to-do">
              <li>
                <div>
                  <label class="pure-checkbox">
                    <input type="checkbox" checked>
                    ATV 46 Checklist
                  </label>
                </div>
              </li>
              <li>
                <div>
                  <label class="pure-checkbox">
                    <input type="checkbox">
                    Engine 44 Checklist
                  </label>
                </div>
              </li>
              <li>
                <div>
                  <label class="pure-checkbox">
                    <input type="checkbox">
                    Engine 46 Checklist
                  </label>
                </div>
              </li>
              <li>
                <div>
                  <label class="pure-checkbox">
                    <input type="checkbox">
                    Engine 48 Checklist
                  </label>
                </div>
              </li>
              <li>
                <div>
                  <label class="pure-checkbox">
                    <input type="checkbox">
                    Rescue 44 Checklist
                  </label>
                </div>
              </li>
              <li>
                <div>
                  <label class="pure-checkbox">
                    <input type="checkbox">
                    Rescue 46 Checklist
                  </label>
                </div>
              </li>
              <li>
                <div>
                  <label class="pure-checkbox">
                    <input type="checkbox">
                    Ladder Checklist
                  </label>
                </div>
              </li>
            </ul>
          </div>
          <div class="pure-u-2-5 tile">
            <div class="tile-head">
              <h3 class="pure-u-4-5">Settings</h3>
              <ul class="pure-u-1-5 options">
                <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                </li>
                <li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i
                    class="fa fa-wrench"></i></a>
                  <ul class="dropdown-menu" role="menu">
                  </ul>
                </li>
                <li><a class="close-link"><i class="fa fa-close"></i></a>
                </li>
              </ul>
            </div>
            <ul class="quick-list">
              <li><i class="pure-u-1-8 fa fa-table"></i><a uiSref="report">Reports</a></li>
              <li><i class="pure-u-1-8 fa fa-bar-chart"></i><a uiSref="statistic">Statistics</a></li>
              <li><i class="pure-u-1-8 fa fa-wrench"></i><a uiSref="eEquipment">Edit Equipment</a></li>
              <li><i class="pure-u-1-8 fa fa-list-alt"></i><a uiSref="eReport">Edit Reports</a></li>
              <li><i class="pure-u-1-8 fa fa-user"></i><a uiSref="eUser">Edit Users</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>`
  , styleUrls: ['./menu.sass']
})
export class Home { }

@Component({
  template: `
    <div class="header">
      <h1>Report</h1>
    </div>

    <div class="content">
      <item-table [heading]="heading" [rows]="reports" [tableType]="'view'"></item-table>
    </div>
  `
  , styleUrls: ['./menu.sass']
})
export class Report {
  heading: any[] = ['Name','Schedule','Status','ID'];
  reports: any[] = [
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012',
      data: {
        heading: ['Compartment','Item','Sun','Mon','Tues','Wed','Thur','Fri','Sat'],
        rows: [
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
          {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'}
        ]
      }
    },
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014',
      data: {
        heading: ['Compartment','Item','Sun','Mon','Tues','Wed','Thur','Fri','Sat'],
        rows: [
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
          {Compartment: "Driver #2",    Item: "Radios", Sun: "Okay",    Mon: 'Okay',   Tues: 'Repair', Wed: 'Repair', Thur: 'Broken', Fri: 'Okay',   Sat: 'Okay'}
        ]
      }
    },
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015',
      data: {
        heading: ['Compartment','Item','Status'],
        rows: [
          {Compartment: "Driver #1",    Item: "Horn",   Status: 'Okay'  },
          {Compartment: "Driver #1",    Item: "Lights", Status: '    '  },
          {Compartment: "Driver #1",    Item: "Bells",  Status: 'Okay'  },
          {Compartment: "Driver #1",    Item: "Horn",   Status: '    '  },
          {Compartment: "Driver #1",    Item: "Lights", Status: 'Okay'  },
          {Compartment: "Driver #1",    Item: "Bells",  Status: 'Broken'},
          {Compartment: "Driver #1",    Item: "Horn",   Status: '    '  },
          {Compartment: "Driver #1",    Item: "Lights", Status: 'Okay'  },
          {Compartment: "Driver #1",    Item: "Bells",  Status: 'Okay'  },
          {Compartment: "Driver #2",    Item: "Map",    Status: 'Okay'  },
          {Compartment: "Driver #2",    Item: "Radios", Status: ''      },
          {Compartment: "Driver #2",    Item: "Radios", Status: 'Okay'  },
          {Compartment: "Driver #2",    Item: "Radios", Status: 'Okay'  }
        ]
      }
    }
  ];
}

@Component({
  template: `
    <div class="header">
      <h1>Statistic</h1>
    </div>

    <div class="content">
      <canvas baseChart
              [datasets]="barChartData"
              [labels]="barChartLabels"
              [options]="barChartOptions"
              [legend]="barChartLegend"
              [chartType]="barChartType"></canvas>
    </div>
  `
  , styleUrls: ['./menu.sass']
})
export class Statistic {

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Broken'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Needs Repair'},
    {data: [8,  18, 20, 29, 23, 47, 44], label: 'Missing'}
  ];
}

@Component({
  template: `
    <div class="header">
      <h1>Extra</h1>
    </div>

    <div class="content">

    </div>
  `
  , styleUrls: ['./menu.sass']
})
export class Extra { }

/** States */

let states = [
    { name: 'home',       url: '',                component: Home         }
  , { name: 'report',     url: '/reports',        component: Report       }
  , { name: 'eEquipment', url: '/edit/equipment', component: EditEquipment}
  , { name: 'eReport',    url: '/edit/report',    component: EditReport   }
  , { name: 'eTruck',     url: '/edit/truck',     component: EditTruck    }
  , { name: 'eUser',      url: '/edit/users',     component: EditUser     }
  , { name: 'statistic',  url: '/statistics',     component: Statistic    }
  , { name: 'extra',      url: '/extras',         component: Extra        }
  , { name: 'table',      url: '',                component: Table        }
];

@NgModule({
  declarations: [ AppComponent, Home, Report, EditEquipment, EditReport, EditTruck, EditUser, Statistic, Extra, Table, Modal ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    UIRouterModule.forRoot({ states: states, useHash: true }),
    MdDialogModule,
    FormsModule,
    ChartsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [Modal]
})
export class AppModule { }
