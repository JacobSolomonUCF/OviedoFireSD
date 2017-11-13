import {Component, ElementRef, ViewChild} from "@angular/core";
import {WebService} from "../services/webService";

@Component({
	template: `
		<div class="header">
			<h1>Statistics</h1>
		</div>

		<div class="content" [ngSwitch]="loading">
			<div *ngSwitchCase="true" class="centered">
				<i class="fa fa-5x fa-spinner fa-pulse"></i>
			</div>
			<div *ngSwitchCase="false">
				<select [(ngModel)]="index" (change)="switchTo()">
					<option *ngFor="let data of original; index as i" [value]="i">{{data.title}}</option>
				</select>
				<select [(ngModel)]="level" (change)="switchTo()">
					<option *ngFor="let time of original[index].details; index as i" [value]="i">{{time}}</option>
				</select>

				<canvas #myChart
								baseChart
								[datasets]="barChartData"
								[labels]="barChartLabels"
								[options]="barChartOptions"
								[legend]="barChartLegend"
								[chartType]="barChartType"></canvas>
			</div>
		</div>
	`
	, styleUrls: ['../menu.sass']
})
export class Statistic {

	@ViewChild('myChart') myChart: ElementRef;

	loading = true;
	public barChartOptions: any = {
		scaleShowVerticalLines: false,
		responsive: true,
		scales: {
			yAxes: [{
				display: true,
				ticks: {
					beginAtZero: true,
					suggestedMax: 10
				}
			}]
		}
	};
	public barChartLabels: string[] = [];
	public barChartType: string = 'bar';
	public barChartLegend: boolean = true;
	public index: number = 0;
	public level: number = 0;
	public original: any[];
	public barChartData: any[] = [];

	constructor(webService: WebService) {
		webService.setState('statistics')
			.doGet('/statistics')
			.subscribe(resp => {

				let result = {...resp['results'][0][resp['results'][0].details[0]]};
				this.original = resp['results'];
				this.barChartLabels = [...result.labels];
				if (!result.data) result.data = this.barChartLabels.map(label => { return {label: label, data:[0]}});
				this.barChartData = [...result.data];
			}, () => {
				this.loading = false;
			}, () => {
				this.loading = false;
			})
		;
	}

	switchTo(retry = false) {
		this.barChartLabels.length = 0;
		let time = this.original[this.index].details[this.level];
		if (!time) {
			this.level = 0;
			return retry ? false : this.switchTo(true);
		}
		let data = this.original[this.index][time];
		data.labels.forEach(label => {
			this.barChartLabels.push(label);
		});
		this.barChartData = data.data;
	}
}
