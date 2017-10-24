import {Component} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
  template: `
    <div>
      <div class="header">
        <h1>Home</h1>
      </div>

      <div class="content">
        <!-- top tiles -->
        <div class="row tile_count" style="text-align: center">
          <div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
            <div class="count_top"><i class="fa fa-user"></i> Users</div>
            <div class="count" *ngIf="totalUsers">{{totalUsers}}</div>
            <i class="fa fa-2x fa-spinner fa-pulse" *ngIf="!totalUsers && loading"></i>
          </div>
          
          <div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
            <div class="count_top"><i class="fa fa-table"></i> Reports</div>
            <div class="count" *ngIf="totalReports">{{totalReports}}</div>
            <i class="fa fa-2x fa-spinner fa-pulse" *ngIf="!totalReports && loading"></i>
          </div>
          
          <div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
            <div class="count_top"><i class="fa fa-tasks"></i> Todo</div>
            <div style="font-size: 2em;" *ngIf="reportsToDo">{{reportsToDo}}</div>
            <i class="fa fa-2x fa-spinner fa-pulse" *ngIf="!reportsToDo && loading"></i>
          </div>
        </div>
        <br>

        <div class="row">
          <div class="pure-u-2-5 tile">
            <div class="tile-head">
              <h3 class="pure-u-4-5">To Do List</h3>
              <ul class="pure-u-1-5 options" hidden>
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
            <div class="centered" *ngIf="loading">
              <br/>
              <i class="fa fa-5x fa-spinner fa-pulse"></i>
            </div>
            <ul class="to-do">
              <li *ngFor="let todo of toDoList; let i = index">
                <div>
                  <label class="pure-checkbox">
                    <i class="fa fa-lg fa-square-o" style="background-color: white"></i>
                    {{todo.title}}
                  </label>
                </div>
              </li>
            </ul>
          </div>
          <div class="pure-u-2-5 tile">
            <div class="tile-head">
              <h3 class="pure-u-4-5">Completed List</h3>
              <ul class="pure-u-1-5 options" hidden>
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
            <div class="centered" *ngIf="loading">
              <br/>
              <i class="fa fa-5x fa-spinner fa-pulse"></i>
            </div>
            <ul class="to-do">
              <li *ngFor="let todo of completeList; let i = index">
                <div>
                  <label class="pure-checkbox">
                    <input type="checkbox" checked (click)="nada()"/>
                    {{todo.title}}
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>`
  , styleUrls: ['../menu.sass']
})
export class Home {
  loading: boolean = true;
  toDoList: any[] = [];
  equipment: number;
  totalUsers: number;
  reportsToDo: number;
  completeList: any[] = [];
  totalReports: number;

  constructor(public webService: WebService) {
    let self = this;
    webService.setState('home')
      .getHome()
      .subscribe(resp => {
          resp['toDoList'].map(toDo => {(toDo.complete ? this.completeList : this.toDoList).push(toDo);});
          this.equipment = resp['equipment'];
          this.totalUsers = resp['totalUsers'];
          this.reportsToDo = resp['reportsToDo'];
          this.totalReports = resp['totalReports'];
        }, () => {
        },
        () => {
          this.loading = false;
        });
  }
  nada() {

  }
}
