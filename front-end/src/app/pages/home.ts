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
				<div *ngFor="let alert of alertTypes">
					<div *ngIf="alerts && alerts[alert.type] && alerts[alert.type].count"
							 class="alert alert-{{alert.style}} tile flex-grow">
						<div class="tile-head">
							<h3 class="pure-u-1">
								{{alert.title}}
							</h3>
						</div>
						<div class="centered" *ngIf="loading"><i class="fa fa-5x fa-spinner fa-pulse"></i></div>
						<ul class="to-do">
							<li *ngFor="let message of alerts[alert.type].properties">
								<div>
									<label #label class="pure-checkbox" *ngIf="alerts[alert.type][message]" [ngSwitch]="label.value">
										<i class="fa fa-lg fa-spinner fa-pulse" *ngSwitchCase="true"></i>
										<i class="fa fa-lg fa-close" (click)="dismiss('repairItems', message, label)" *ngSwitchDefault></i>
										{{alerts[alert.type][message]}}
									</label>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div class="tile white flex-grow max2">
					<div class="tile-head">
						<h3 class="pure-u-1">To Do List</h3>
					</div>
					<div class="centered" *ngIf="loading">
						<br/>
						<i class="fa fa-5x fa-spinner fa-pulse"></i>
					</div>
					<ul class="to-do white">
						<li *ngFor="let todo of toDoList">
							<div class="white">
								<label class="pure-checkbox">
									<i class="fa fa-minus"></i>
									{{todo.title}}
								</label>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>`
	, styleUrls: ['../menu.sass']
})
export class Home {
	alerts: any[];
	loading: boolean = true;
	toDoList: any[] = [];
	equipment: number;
	totalUsers: number;
	reportsToDo: number;
	completeList: any[] = [];
	totalReports: number;

	alertTypes: any[] = [
		{style: 'danger', title: 'Repairs Needed', type: 'repairItems'},
		{style: 'info', title: 'Missing Equipment', type: 'missingItems'},
		{style: 'warning', title: 'Forgotten Reports', type: 'incompleteForms'},
		{style: 'danger', title: 'Failed Items', type: 'failItems'}
	];

	constructor(public webService: WebService) {
		webService.setState('home')
			.getHome()
			.subscribe(resp => {
					this.alerts = resp['alerts'];
					if (this.alerts) {
						this.alertTypes.map(alert => {
							if (this.alerts[alert.type]) {
								let keys = Object.keys(this.alerts[alert.type]);
								this.alerts[alert.type].properties = keys;
								this.alerts[alert.type].count = keys.length;
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

	dismiss(type, index, label = {value: false}) {
		label.value = true;
		let body = {type: type, key: index};
		this.webService.doPost('/dismissAlert', body, '&type=' + type + '&key=' + index).subscribe(() => {
			this.alerts[type].count--;
			if (!this.alerts[type].count) delete this.alerts[type];
			else delete this.alerts[type][index];
		});
	}
}
