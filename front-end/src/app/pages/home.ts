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

				<div class="row flex">
					<div class="alert alert-danger tile flexgrow" *ngIf="alerts && alerts.repairItems">
						<div class="tile-head">
							<h3 class="pure-u-4-5">Repairs Needed</h3>
						</div>
						<div class="centered" *ngIf="loading">
							<br/>
							<i class="fa fa-5x fa-spinner fa-pulse"></i>
						</div>
						<ul class="to-do">
							<li *ngFor="let x of alerts.repairItems.properties">
								<div>
									<label class="pure-checkbox">
										<i class="fa fa-lg fa-close" (click)="dismiss('repairItems', x)"></i>
										{{alerts.repairItems[x]}}
									</label>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="row flex wrap">
					<div class="alert alert-info tile flexgrow max2" *ngIf="alerts && alerts.missingItems">
						<div class="tile-head">
							<h3 class="pure-u-4-5">Missing Equipment</h3>
						</div>
						<div class="centered" *ngIf="loading">
							<br/>
							<i class="fa fa-5x fa-spinner fa-pulse"></i>
						</div>
						<ul class="to-do">
							<li *ngFor="let x of alerts.missingItems.properties">
								<div>
									<label class="pure-checkbox">
										<i class="fa fa-lg fa-close" (click)="dismiss('missingItems', x)"></i>
										{{alerts.missingItems[x]}}
									</label>
								</div>
							</li>
						</ul>
					</div>
					<div class="alert alert-warning tile flexgrow max2" *ngIf="alerts && alerts.incompleteForms">
						<div class="tile-head">
							<h3 class="pure-u-4-5">Forgotten Reports</h3>
						</div>
						<div class="centered" *ngIf="loading">
							<br/>
							<i class="fa fa-5x fa-spinner fa-pulse"></i>
						</div>
						<ul class="to-do">
							<li *ngFor="let x of alerts.incompleteForms.properties">
								<div>
									<label class="pure-checkbox">
										<i class="fa fa-lg fa-close" (click)="dismiss('incompleteForms', x)"></i>
										{{alerts.incompleteForms[x]}}
									</label>
								</div>
							</li>
						</ul>
					</div>
					<div class="tile white flexgrow max2">
						<div class="tile-head">
							<h3 class="pure-u-4-5">To Do List</h3>
							<ul class="pure-u-1-5 options" hidden>
								<li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
								</li>
								<li class="dropdown">
									<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
										 aria-expanded="false"><i
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
						<ul class="to-do white">
							<li *ngFor="let todo of toDoList; let i = index">
								<div class="white">
									<label class="pure-checkbox">
										<i class="fa fa-lg fa-square-o" style="background-color: white"></i>
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
	alerts;
	loading: boolean = true;
	toDoList: any[] = [];
	equipment: number;
	totalUsers: number;
	reportsToDo: number;
	completeList: any[] = [];
	totalReports: number;

	constructor(public webService: WebService) {
		webService.setState('home')
			.getHome()
			.subscribe(resp => {
					this.alerts = resp['alerts'];
					if (this.alerts.incompleteForms) this.alerts.incompleteForms.properties = Object.keys(this.alerts.incompleteForms);
					if (this.alerts.missingItems) this.alerts.missingItems.properties = Object.keys(this.alerts.missingItems);
					if (this.alerts.repairItems) this.alerts.repairItems.properties = Object.keys(this.alerts.repairItems);
					resp['toDoList'].map(toDo => {
						(toDo.complete ? this.completeList : this.toDoList).push(toDo);
					});
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

	dismiss(type, index) {
		this.webService.doPost('/dismissAlert', {type: type, key: index}).subscribe(() => {
			this.alerts[type].splice(index, 1);
		});
	}
}
