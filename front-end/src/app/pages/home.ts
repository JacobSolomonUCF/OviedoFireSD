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
				<div class="row tile_count centered">
					<div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
						<div class="count_top"><i class="fa fa-user"></i> Users</div>
						<div class="count" *ngIf="totalUsers">{{totalUsers}}</div>
						<i class="fa fa-2x fa-spinner fa-pulse" *ngIf="!totalUsers && loading"></i>
					</div>

					<div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
						<div class="count-top"><i class="fa fa-table"></i> Reports</div>
						<div class="count" *ngIf="totalReports">{{totalReports}}</div>
						<i class="fa fa-2x fa-spinner fa-pulse" *ngIf="!totalReports && loading"></i>
					</div>

					<div class="pure-u-1-5 col-sm-4 col-xs-6 tile_stats_count">
						<div class="count-top"><i class="fa fa-tasks"></i> Todo</div>
						<div class="count count-last" *ngIf="reportsToDo">{{reportsToDo}}</div>
						<i class="fa fa-2x fa-spinner fa-pulse" *ngIf="!reportsToDo && loading"></i>
					</div>
				</div>
				<br>
				<div class="row flex">
					<div class="alert alert-danger tile flex-grow"
							 *ngIf="alerts && alerts.repairItems && alerts.repairItems.count">
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
									<label class="pure-checkbox" *ngIf="alerts.repairItems[x]">
										<i class="fa fa-lg fa-close" (click)="dismiss('repairItems', x)"></i>
										{{alerts.repairItems[x]}}
									</label>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="row flex wrap">
					<div class="alert alert-info tile flex-grow max2"
							 *ngIf="alerts && alerts.missingItems && alerts.missingItems.count">
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
									<label class="pure-checkbox" *ngIf="alerts.missingItems[x]">
										<i class="fa fa-lg fa-close" (click)="dismiss('missingItems', x)"></i>
										{{alerts.missingItems[x]}}
									</label>
								</div>
							</li>
						</ul>
					</div>
					<div class="alert alert-warning tile flex-grow max2"
							 *ngIf="alerts && alerts.incompleteForms && alerts.incompleteForms.count">
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
									<label class="pure-checkbox" *ngIf="alerts.incompleteForms[x]">
										<i class="fa fa-lg fa-close" (click)="dismiss('incompleteForms', x)"></i>
										{{alerts.incompleteForms[x]}}
									</label>
								</div>
							</li>
						</ul>
					</div>
					<div class="tile white flex-grow max2">
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
										<i class="fa fa-lg fa-square-o white"></i>
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
					if (this.alerts) {
						['incompleteForms', 'missingItems', 'repairItems'].map(prop => {
							if (this['alerts'][prop]) {
								let keys = Object.keys(this['alerts'][prop]);
								this['alerts'][prop].properties = keys;
								this['alerts'][prop].count = keys.length;
							}
						});
					}
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
		this.webService.doPost('/dismissAlert?type=' + type + '&key=' + index + '&uid=' + this.webService.getUID(), {
			type: type,
			key: index
		}).subscribe(() => {
			this.alerts[type].count--;
			if (!this.alerts[type].count) delete this.alerts[type];
			else delete this.alerts[type][index];
		});
	}
}
