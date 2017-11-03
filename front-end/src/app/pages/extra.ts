import {Component} from "@angular/core";
import {WebService} from "../services/webService";
import {saveAs} from 'file-saver';

@Component({
	template: `
		<div class="header">
			<h1>Extras</h1>
		</div>

		<div class="content">
			<div class="row flex">
				<div class="tile white flex-grow" [ngSwitch]="message">
					<div class="tile-head">
						<h3 *ngSwitchCase="true">Confirmation</h3>
						<h3 *ngSwitchDefault>Downloads</h3>
					</div>
					<div *ngSwitchCase="true">
						<p>Please wait a moment you will be prompted to save your reports.</p>
						<p>Proceed to result clear?
							<button class="default" (click)="message = false">No</button>
							<button class="accept short" (click)="clear()">Yes</button>
						</p>
					</div>
					<ul class="to-do white" *ngSwitchDefault>
						<li>
							<i class="fa fa-android"></i> <a href="/assets/applications/OviedoFire.apk">Android .apk</a>
						</li>
						<li>
							<i class="fa fa-apple"></i> <a href="/assets/applications/OviedoFire.pdk">iOS .pdk</a>
						</li>
						<li>
							<i class="fa fa-external-link"></i>
							<select #x [ngModel]="year" (change)="year = x.value">
								<option value="" label="Select a year"></option>
								<option *ngFor="let y of years" [value]="y" [label]="y" selected></option>
							</select>
							<a *ngIf="year" (click)="message = true" href="{{backUp()}}">download</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	`
	, styleUrls: ['../menu.sass']
})
export class Extra {
	webService: WebService;
	message: boolean = false;
	years: any;
	year: string = '';

	constructor(webService: WebService) {
		this.webService = webService.setState('extras');
		this.webService.doGet('/availableYears')
			.subscribe(resp => this.years = resp);
	}

	backUp() {
		return this.webService.baseUrl + '/downloadReports' + this.webService.token() + '&year=' + this.year;
	}

	clear() {
		this.webService.doDelete('/clearReports', {})
			.subscribe(() => {
			}, () => {
			}, () => {
				this.message = false
			});
		this.message = true;
	}

}
