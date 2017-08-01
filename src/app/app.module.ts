import { BrowserModule } from '@angular/platform-browser';
import {Component, NgModule, ViewEncapsulation} from '@angular/core';

import {UIRouterModule} from "@uirouter/angular";
import { AppComponent } from "./app.component"


@Component({
  template: `
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
          <div class="count">3</div>
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
      <!--<br>-->

      <div class="row">
        <div class="pure-u-1-3 col-sm-4 col-xs-12">
          <div class="x_panel">
            <div class="x_title">
              <h2>To Do List <small>Sample tasks</small></h2>
              <ul class="nav navbar-right panel_toolbox">
                <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                </li>
                <li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                  <ul class="dropdown-menu" role="menu">


                  </ul>
                </li>
                <li><a class="close-link"><i class="fa fa-close"></i></a>
                </li>
              </ul>
              <div class="clearfix"></div>
            </div>
            <div class="x_content">

              <div class="">
                <ul class="to_do">
                  <li>
                    <p>
                    </p><div class="icheckbox_flat-green checked" style="position: relative;"><input type="checkbox" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> ATV 46 Checklist <p></p>
                  </li>
                  <li>
                    <p>
                    </p><div class="icheckbox_flat-green checked" style="position: relative;"><input type="checkbox" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> Engine 44 Checklist<p></p>
                  </li>
                  <li>
                    <p>
                    </p><div class="icheckbox_flat-green" style="position: relative;"><input type="checkbox" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> Engine 46 Checklist <p></p>
                  </li>
                  <li>
                    <p>
                    </p><div class="icheckbox_flat-green" style="position: relative;"><input type="checkbox" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> Engine 48 Checklist<p></p>
                  </li>
                  <li>
                    <p>
                    </p><div class="icheckbox_flat-green checked" style="position: relative;"><input type="checkbox" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> Rescue 44 Checklist <p></p>
                  </li>
                  <li>
                    <p>
                    </p><div class="icheckbox_flat-green checked" style="position: relative;"><input type="checkbox" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> Rescue 46 Checklist <p></p>
                  </li>
                  <li>
                    <p>
                    </p><div class="icheckbox_flat-green" style="position: relative;"><input type="checkbox" class="flat" style="position: absolute; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> Ladder Checklist <p></p>
                  </li>


                </ul>
              </div>
            </div>
          </div>            
        </div>


        <div class="pure-u-1-3 col-sm-4 col-xs-12">
          <div class="x_panel tile fixed_height_320">
            <div class="x_title">
              <h2>Quick Settings</h2>
              <ul class="nav navbar-right panel_toolbox">
                <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
                </li>
                <li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i class="fa fa-wrench"></i></a>
                  <ul class="dropdown-menu" role="menu">
                    <li><a href="#">Settings 1</a>
                    </li>
                    <li><a href="#">Settings 2</a>
                    </li>
                  </ul>
                </li>
                <li><a class="close-link"><i class="fa fa-close"></i></a>
                </li>
              </ul>
              <div class="clearfix"></div>
            </div>
            <div class="x_content">
              <div class="dashboard-widget-content">
                <ul style="width=100px" class="quick-list">
                  <li style="width=100px"><i class="fa fa-table"></i><a href="#">Reports</a>
                  </li>

                  <li><i class="fa fa-bar-chart"></i><a href="#">Statistics</a> </li>
                  <li><i class="fa fa-wrench"></i><a href="#">Edit Equipment</a>
                  </li>
                  <li><i class="glyphicon glyphicon-list-alt"></i><a href="#">Edit Reports</a> </li>
                  <li><i class="fa fa-user"></i><a href="#">Edit Users</a>
                  </li>
                  <li><i class="glyphicon glyphicon-off"></i><a href="#">Logout</a>
                  </li>
                </ul>


              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .tile_count
      display: flex
      justify-content: space-around
  `],
  encapsulation: ViewEncapsulation.None
})
export class Home { }

@Component({
  template: `
    <div class="header">
      <h1>Report</h1>
    </div>

    <div class="content">
      report stuff
    </div>
  `
})
export class Report { }

/** States */

let aboutState = { name: 'report', url: '/reports',  component: Report };

@NgModule({
  declarations: [
    AppComponent,
    Home,
    Report
  ],
  imports: [
    BrowserModule,
    UIRouterModule.forRoot({ states: [ { name: 'home', url: '',  component: Home }, aboutState ], useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
