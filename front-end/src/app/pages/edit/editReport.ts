import {Component, ViewChild} from "@angular/core";
import {WebService} from "../../services/webService";

@Component({
	template: `
		<div class="header">
			<h1>Edit Reports</h1>
		</div>
		<div class="content" [ngSwitch]="loading">
			<div *ngSwitchCase="true" class="centered">
				<i class="fa fa-5x fa-spinner fa-pulse"></i>
			</div>
			<div *ngSwitchCase="false">
				<div [ngSwitch]="viewType">
					<div *ngSwitchCase="'view'">
						<div [ngSwitch]="reorder">
							<div class="table-options" *ngSwitchCase="true">
								<button class="close" (click)="toggle()">
									<i class="fa fa-chevron-left"></i> Back
								</button>
								<div class="right">
									<button class="accept short" (click)="submitReport()" [disabled]="!diff(reports, original)">Submit
									</button>
								</div>
							</div>
							<div class="table-options" *ngSwitchDefault>
								<div class="left">
									<button class="add" (click)="onclick(undefined)">
										<i class="fa fa-plus"></i> Create new
									</button>
									<button class="add" (click)="viewType = 'copy'">
										<i class="fa fa-copy"></i> Copy report
									</button>
									<button class="add" (click)="reorder = true">
										<i class="fa fa-arrows"></i> Reorder reports
									</button>
								</div>
								<div class="right">
									<input
										#tableFilter
										class='filter'
										type='text'
										[ngModel]="filter"
										placeholder='Type to filter...'
										(keyup)='updateFilter($event)'/>
								</div>
							</div>
						</div>
						<ngx-datatable
							#myTable
							class="table"
							[selectionType]="'single'"
							[columnMode]="'flex'"
							[rowHeight]="'auto'"
							[rows]="reports">
							<ngx-datatable-column [name]="'Report'" [prop]="'template.title'" [flexGrow]="2">
								<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row">
									<div [ngSwitch]="reorder">
										<div *ngSwitchCase="true">
											<select #location
															(change)="location.value = move(reports, rowIndex, location.value)">
												<option *ngFor="let indexes of Arr(reports.length).keys()" [value]="indexes"
																[selected]="indexes === rowIndex">
													{{indexes + 1}}
												</option>
											</select>
											{{value}}
										</div>
										<div (click)="onclick(row)" *ngSwitchDefault>
											{{value}}
										</div>
									</div>
								</ng-template>
							</ngx-datatable-column>
							<ngx-datatable-column [name]="'Frequency'" [prop]="'interval.frequency'" [flexGrow]="1">
								<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row">
									<div (click)="onclick(row)">
										{{value}}
									</div>
								</ng-template>
							</ngx-datatable-column>
							<ngx-datatable-column [name]="'QR Code'" [prop]="'template.title'" [flexGrow]="1">
								<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row">
									<span *ngIf="row.itemCategory === 'vehicles'">
										<button class="close padding-0" (click)="viewQRCodes(row)">
											<i class="fa fa-lg fa-qrcode"></i> View codes
										</button>
									</span>
									<span *ngIf="row.itemCategory !== 'vehicles'">
										<button class="close padding-0">
											<qr-clickable [value]="row.id" [title]="row.template.title"></qr-clickable>
										</button>
									</span>
								</ng-template>
							</ngx-datatable-column>
						</ngx-datatable>
					</div>
					<div *ngSwitchCase="'copy'">
						<div class="table-options">
							<div class="left">
								<button class="close" (click)="toggle()">
									<i class="fa fa-chevron-left"></i> Back
								</button>
							</div>
						</div>
						<div class="tile white pure-form pure-form-stacked editing" style="min-height: 15vh">
							<span>Which report would you like to copy?</span>
							<select [(ngModel)]="temp">
								<option *ngFor="let report of reports; index as i" [value]="i">{{report.template.title}}</option>
							</select>
							<button class="accept" (click)="onclick()">
								Copy
							</button>
						</div>
					</div>
					<div *ngSwitchCase="'edit'">
						<div class="table-options">
							<div class="left">
								<button class="close" (click)="toggle()">
									<i class="fa fa-chevron-left"></i> Back
								</button>
							</div>
							<div class="center" *ngIf="!temp.fresh">
								<button class="alert alert-danger close short" (click)="deleteReport()">
									<i class="fa fa-trash"></i> Delete
								</button>
							</div>
							<div class="right">
								<button class="accept short" (click)="submitReport()" [disabled]="!submitEnabled()">Submit</button>
							</div>
						</div>
						<div class="tile white pure-form pure-form-stacked editing">
							<span class="flex wrap align">
								<div style="flex-grow: 3" *ngIf="temp.template">
									<label for="text">Title</label>
									<input #text id="text" type="text" [(ngModel)]="temp.template.title"/>
								</div>
								<div class="flex-grow" *ngIf="temp.interval">
									<label for="type">Schedule</label>
									<select style="width: 100%" #schedule id="type" [(ngModel)]="temp.interval.frequency">
										<option *ngFor="let frequency of ['Daily', 'Weekly', 'Monthly']"
														[value]="frequency">{{frequency}}</option>
									</select>
								</div>
								<div class="flex-grow" *ngIf="temp.fresh && temp.interval">
									<label for="type">Category</label>
									<select #category id="type" [(ngModel)]="temp.itemCategory">
										<option *ngFor="let category of ['ladders', 'miscellaneous', 'scbas', 'stretchers', 'vehicles']"
														[value]="category">{{category}}</option>
									</select>
								</div>
								<div style="flex-grow: 2" *ngIf="temp.interval && temp.interval.frequency !== 'Daily'">
									<table>
										<tr>
											<th *ngFor="let heading of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']">{{heading}}</th>
										</tr>
										<tr>
											<td
												*ngFor="let day of ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']">
												<input type="checkbox" [(ngModel)]="temp.interval.days[day]">
											</td>
										</tr>
									</table>
								</div>
							</span>
							<span *ngIf="temp.template" class="flex">
								<div class="flex-grow">
									<label for="text">Alert</label>
									<input #alert id="text" type="text" [(ngModel)]="temp.template.alert"/>
								</div>
							</span>
							<div class="pure-u-1" *ngIf="temp.template">
								<ngx-datatable
									style="max-height: 25vh"
									#myTable
									*ngIf="temp.template.subSections"
									[rows]="temp.template.subSections"
									[rowHeight]="'auto'"
									[selectionType]="'single'"
									[selected]="selected"
									[columnMode]="'flex'">
									<ngx-datatable-column [name]="'Section'" [prop]="'title'" [flexGrow]="1">
										<ng-template ngx-datatable-header-template>
											<div class="flex">
												<span>Section</span>
												<span>
												<button class="close" (click)="addSection()">
													<i class="fa fa-plus"></i>&nbsp;add&nbsp;&nbsp;
												</button>
											</span>
											</div>
										</ng-template>
										<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value"
																 let-row="row">
											<div class="flex">
												<select #location
																(change)="location.value = move(temp.template.subSections, rowIndex, location.value)">
													<option *ngFor="let indexes of Arr(temp.template.subSections.length).keys()" [value]="indexes"
																	[selected]="indexes === rowIndex">
														{{indexes + 1}}
													</option>
												</select>
												<input style="flex-grow: 99" [(ngModel)]="row.title" placeholder="Add a name"/>
												<span class="flex-grow">
													<button class="close" (click)="removeSection(rowIndex)"><i class="fa fa-times"></i></button>
												</span>
											</div>
										</ng-template>
									</ngx-datatable-column>
								</ngx-datatable>
								<hr/>
								<ngx-datatable
									#otherTable
									style="max-height: 25vh"
									*ngIf="selected[0]"
									[rows]="selected[0].inputElements"
									[rowHeight]="'auto'"
									[selectionType]="'single'"
									[columnMode]="'flex'">
									<ngx-datatable-column [name]="'Caption'" [prop]="'caption'" [flexGrow]="2">
										<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value"
																 let-row="row">
											<div class="flex">
												<select #location
																(change)="location.value = move(selected[0].inputElements, rowIndex, location.value)">
													<option *ngFor="let indexes of Arr(selected[0].inputElements.length).keys()" [value]="indexes"
																	[selected]="indexes === rowIndex">
														{{indexes + 1}}
													</option>
												</select>
												<input type="text" [value]="value" style="padding-right: 1em" [(ngModel)]="row.caption"/>
											</div>
										</ng-template>
									</ngx-datatable-column>
									<ngx-datatable-column [prop]="'type'" [flexGrow]="1">
										<ng-template ngx-datatable-header-template>
											<div class="flex">
												<span>type</span>
												<span>
													<button class="close" (click)="add()">
														<i class="fa fa-plus"></i>&nbsp;add&nbsp;&nbsp;
													</button>
												</span>
											</div>
										</ng-template>
										<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value"
																 let-row="row">
											<div class="flex">
												<select id="type" [value]="value" [(ngModel)]="row.type">
													<option value="pmr">Present/Missing/Repair</option>
													<option value="pf">Pass/Fail</option>
													<option value="num">Number</option>
													<option value="per">Percent</option>
												</select>
												<button class="close" (click)="remove(rowIndex)"><i
													class="fa fa-times"></i></button>
											</div>
										</ng-template>
									</ngx-datatable-column>
								</ngx-datatable>
							</div>
						</div>
					</div>
					<div *ngSwitchCase="'qr'">
						<div class="table-options">
							<div class="left">
								<button class="close" (click)="toggle()">
									<i class="fa fa-chevron-left"></i> Back
								</button>
							</div>
						</div>
						<ngx-datatable
							#myTable
							class="table"
							[selectionType]="'single'"
							[columnMode]="'flex'"
							[rowHeight]="'auto'"
							[rows]="temp">
							<ngx-datatable-column [name]="'Section'" [prop]="'title'" [flexGrow]="2">
								<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row">
									{{value}}
								</ng-template>
							</ngx-datatable-column>
							<ngx-datatable-column [flexGrow]="1" [name]="'QR Code'" [prop]="'title'">
								<ng-template ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row">
									<qr-clickable #qr [value]="row.id" [title]="row.title"></qr-clickable>
								</ng-template>
							</ngx-datatable-column>
						</ngx-datatable>
					</div>
				</div>
			</div>
		</div>
	`
	, styleUrls: ['../../menu.sass']
})
export class EditReport {
	Arr = Array;

	reorder: boolean = false;

	@ViewChild('qr') qr;
	@ViewChild('myTable') table;
	viewType: string = 'view';

	constructor(public webService: WebService) {

		webService.setState('eReport')
			.doGet('/listReports')
			.subscribe(resp => {
					this.original = resp['list'].map(report => {
						if (report.interval.frequency === 'Daily')
							for (let i = 0, len = report.template.subSections.length; i < len; i++)
								if (report.template.subSections[i].title.indexOf(report.template.title) !== -1)
									report.template.subSections[i].title = report.template.subSections[i].title.substring(report.template.title.length + 3);
						return report
					});
					this.reports = JSON.parse(JSON.stringify(this.original));
					this.loading = false;
				}, () => {
					this.loading = false;
				}
			);
	}
	loading: boolean = true;
	heading: any[] = [
		{prop: 'name', flexGrow: 3, dragable: false, resizeable: true},
		{prop: 'schedule', flexGrow: 1, dragable: false, resizeable: true},
	];
	reports: any[];
	selected = [];
	original;
	copy;
	filter: string = '';
	temp;

	weekDaily = {
		sunday: true,
		monday: true,
		tuesday: true,
		wednesday: true,
		thursday: true,
		friday: true,
		saturday: true
	};

	move(array: any[], from: number, to: number) {
		array.splice(to, 0, array.splice(from, 1)[0]);
		return from;
	};

	diff(a, b) {
		if (a.length != b.length)
			return true;
		for (let i = 0, len = a.length; i < len; i++)
			if (a[i].id != b[i].id)
				return true;
		return false;
	};

	onclick(event = this.reports[this.temp]) {

		this.copy = !event ? undefined : {
			fresh: true,
			itemCategory: event.itemCategory,
			template: event.template,
			interval: event.interval
		};
		let fresh = event ? event : {
			fresh: true,
			itemCategory: false,
			template: {subSections: []},
			interval: {
				frequency: "",
				days: this.weekDaily
			}
		};

		if (this.viewType === 'copy') {
			let copy = {...this.copy};
			copy.template.title = this.copy.template.title + ' (Copy)';
			this.temp = copy;
		} else if (this.viewType === 'edit') {
			this.selected = event.selected;
			return;
		} else if (this.viewType === 'view') {
			this.temp = (event) ? event : fresh;
		}

		this.viewType = 'edit';
		this.selected = (this.temp.template.subSections) ? [this.temp.template.subSections[0]] : [this.temp.template];
	}

	submitEnabled() {
		return (!!this.temp.template.title && !!this.temp.interval.frequency && !!(!this.temp.fresh || this.temp.itemCategory) && !!this.temp.template.subSections.length);
	}

	submitReport() {
		if (this.reorder) {
			console.log('reports', this.reports);
			this.webService.doPost('/orderReports', {reports: this.reports})
				.subscribe(() => {
					this.original = JSON.parse(JSON.stringify(this.reports));
				}, error => {
					console.log(error);
					this.toggle();
				}, () => {
					this.toggle()
				});
		} else if (this.submitEnabled()) {
			this.loading = true;
			if (this.temp.interval.frequency === 'Daily')
				this.temp.interval.days = this.weekDaily;
			this.webService.doPost('/listReports', {report: this.temp})
				.subscribe(() => {
					if (this.temp.fresh)
						this.reports.push(this.temp);
					this.original = JSON.parse(JSON.stringify(this.reports));
					this.toggle();
				}, error => {
					console.log(error);
				}, () => {
					this.loading = false;
				});
		} else
			console.log('Missing a field');
	}

	deleteReport() {
		if (this.temp.fresh || !this.temp.id || !this.temp.itemCategory)
			return;
		this.loading = true;
		this.webService.doDelete('/listReports', {id: this.temp.id, itemCategory: this.temp.itemCategory})
			.subscribe(() => {
				this.reports.splice(this.reports.indexOf(this.temp), 1);
				this.toggle()
			}, () => {
			}, () => {
				this.loading = false;
			})
		;
	}

	addSection() {
		let emptySection = {title: "", inputElements: []};
		let len = this.temp.template.subSections.length;
		for (let i = 0; i < len; i++) {
			if (this.temp.template.subSections[i].title === emptySection.title) {
				return;
			}
		}
		this.selected = [emptySection];
		this.temp.template.subSections.unshift(emptySection);
	}

	removeSection(index) {
		if (this.temp.template.subSections[index] === this.selected[0]) this.selected = [];
		this.temp.template.subSections.splice(index, 1);
		this.temp.template.subSections = [...this.temp.template.subSections];
	}

	add() {
		let emptySection = {title: "", type: ""};
		this.selected[0].inputElements.unshift(emptySection);
	}

	remove(row) {
		this.selected[0].inputElements.splice(row, 1);
	}

	toggle() {
		delete this.temp;
		delete this.reorder;
		this.viewType = 'view';
		this.reports = JSON.parse(JSON.stringify(this.original));
		this.updateFilter(undefined);
	}

	updateFilter(event) {
		const val = (!event) ? '' : event.target.value.toLowerCase();
		if (!event) this.filter = "";

		this.reports = this.original.filter(row => {
			if (row.template.title.toLowerCase().indexOf(val) !== -1)
				return true;
			return row.interval.frequency.toLowerCase().indexOf(val) !== -1;

		});
	}

	viewQRCodes(row) {
		this.viewType = 'qr';
		this.temp = row.template.subSections;
	}
}
