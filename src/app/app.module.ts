import {BrowserModule} from '@angular/platform-browser';
import {Component, Input, NgModule} from '@angular/core';

import {UIRouterModule} from "@uirouter/angular";
import {AppComponent} from "./app.component"


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
              <li><i class="pure-u-1-8 fa fa-power-off"></i><a uiSref="eLogout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

    </div>`
  , styleUrls: ['./menu.sass']
})
export class Home { }

@Component({
  selector: `item-table`,
  template: `
    <div class="table">
      <table>
        <thead>
        <th *ngFor="let head of heading">
          <div>
            {{head}}
            <button class="fa fa-chevron-up"></button>
            <button class="fa fa-chevron-down"></button>
         </div>
        </th>
        </thead>
        <tbody>
        <tr *ngFor="let row of rows">
          <td *ngFor="let head of heading">
            {{row[head]}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>`
  , styleUrls: ['./table.sass']
})
export class Table {

  @Input() heading: string[];
  @Input() rows: any[];
}

@Component({
  template: `
    <div class="header">
      <h1>Report</h1>
    </div>

    <div class="content">
      <item-table [heading]="['col1','col2']" [rows]="reports"></item-table>
    </div>
  `
  , styleUrls: ['./menu.sass']
})
export class Report {
  reports: any[] = [
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012'},
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014'},
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015'}
  ];
}

@Component({
  template: `
    <div class="header">
      <h1>Edit Reports</h1>
    </div>

    <div class="content">
      <item-table [heading]="['Name','Schedule','Status','ID']" [rows]="reports"></item-table>
    </div>
  `
  , styleUrls: ['./menu.sass']
})
export class EditReport {
  reports: any[] = [
    {Name: "ATV 46 Checklist",    Schedule: "Daily",  Status: "Complete",     ID: '10012'},
    {Name: "Engine 44 Checklist", Schedule: "Daily",  Status: "Complete",     ID: '10014'},
    {Name: "Engine 46 Checklist", Schedule: "Weekly", Status: "Not Complete", ID: '10015'}
  ];
}

@Component({
  template: `
    <div class="header">
      <h1>Statistic</h1>
    </div>

    <div class="content">

    </div>
  `
  , styleUrls: ['./menu.sass']
})
export class Statistic { }

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
    { name: 'home',      url: '',              component: Home      }
  , { name: 'report',    url: '/reports',      component: Report    }
  , { name: 'eReport',   url: '/edit/reports', component: EditReport}
  , { name: 'statistic', url: '/statistics',   component: Statistic }
  , { name: 'extra',     url: '/extras',       component: Extra     }
  , { name: 'table',     url: '',              component: Table     }
];

@NgModule({
  declarations: [ AppComponent, Home, Report, EditReport, Statistic, Extra, Table ],
  imports: [
    BrowserModule,
    UIRouterModule.forRoot({ states: states, useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
