import {Component} from "@angular/core";
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
					<!-- TODO: Download QR -->
					<div *ngSwitchCase="'view'">
						<div class="table-options">
							<div class="left">
								<button class="add" (click)="onclick(undefined, table)">
									<i class="fa fa-plus"></i> Add report
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
						<ngx-datatable
							#myTable
							class="table"
							(select)="onclick($event, myTable)"
							[selectionType]="'single'"
							[columnMode]="'flex'"
							[rowHeight]="'auto'"
							[rows]="reports">
							<ngx-datatable-column [name]="'Report'" [prop]="'template.title'"
																		[flexGrow]="2"></ngx-datatable-column>
							<ngx-datatable-column [name]="'Frequency'" [prop]="'interval.frequency'"
																		[flexGrow]="1"></ngx-datatable-column>
						</ngx-datatable>
					</div>
					<div *ngSwitchCase="'edit'">
						<div class="table-options">
							<div class="left">
								<button class="close" (click)="toggle()">
									<i class="fa fa-chevron-left"></i> Back
								</button>
							</div>
							<div class="center" *ngIf="!temp.fresh">
								<button class="alert alert-danger close short" (click)="deleteReport()"><i
									class="fa fa-trash"></i>Delete
								</button>
							</div>
							<div class="right">
								<button class="accept short" (click)="submitReport()">Submit</button>
							</div>
						</div>
						<div class="tile white pure-form pure-form-stacked editing">
              <span class="flex wrap align">
                <div style="flex-grow: 3" *ngIf="temp.template">
                  <label for="text">Title</label>
                  <input #text id="text" type="text" [(ngModel)]="temp.template.title"/>
                </div>
                <div class="flexgrow" *ngIf="temp.interval">
                  <label for="type">Schedule</label>
                  <select style="width: 100%" #schedule id="type" [(ngModel)]="temp.interval.frequency">
                    <option *ngFor="let x of ['Daily', 'Weekly', 'Monthly']" [value]="x">{{x}}</option>
                  </select>
                </div>
                <div class="flexgrow" *ngIf="temp.fresh && temp.interval">
                  <label for="type">Category</label>
                  <select #category id="type" [(ngModel)]="temp.itemCategory">
                    <option *ngFor="let x of ['ladders', 'miscellaneous', 'scbas', 'stretchers', 'vehicles']"
														[value]="x">{{x}}</option>
                  </select>
                </div>
                <div style="flex-grow: 2" *ngIf="temp.interval && temp.interval.frequency !== 'Daily'">
                  <table>
                    <tr>
                      <th *ngFor="let h of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']">{{h}}</th>
                    </tr>
                    <tr>
                      <td
												*ngFor="let d of ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']">
                        <input type="checkbox" [(ngModel)]="temp.interval.days[d]">
                      </td>
                    </tr>
                  </table>
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
											<div style="display: flex; justify-content: space-between;">
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
											<div (dblclick)="editing = editing === rowIndex ? -1 : rowIndex"
													 style="display: flex; justify-content: space-between;">
                        <span style="flex-grow: 99" [ngSwitch]="editing === rowIndex ? true : false">
                          <input class="mock-mat" style="flex-grow: 99" [(ngModel)]="row.title" placeholder="Add a name"
																 *ngSwitchCase="true"/>
                          <span *ngSwitchCase="false">{{row.title}}</span>
                        </span>
												<span style="flex-grow: 1">
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
											<input type="text" [value]="value" style="padding-right: 1em"
														 [(ngModel)]="row.caption"/>
										</ng-template>
									</ngx-datatable-column>
									<ngx-datatable-column [prop]="'type'" [flexGrow]="1">
										<ng-template ngx-datatable-header-template>
											<div style="display: flex; justify-content: space-between">
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
											<div style="display: flex; justify-content: space-between;">
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
						<!--<div class="pure-u-11-24">-->
						<!--<img src="https://api.qrserver.com/v1/create-qr-code/?data=ATV46ATVS&amp;size=100x100" alt="" title="" />-->
						<!--</div>-->
					</div>
				</div>
			</div>
		</div>
	`
	, styleUrls: ['../../menu.sass']
})
export class EditReport {

	loading: boolean = true;
	heading: any[] = [
		{prop: 'name', flexGrow: 3, dragable: false, resizeable: true},
		{prop: 'schedule', flexGrow: 1, dragable: false, resizeable: true},
	];
	reports: any[];
	viewType: string = 'view';
	temp;
	selected = [];
	original;
	editing = -1;
	filter;

	constructor(public webService: WebService) {

		webService.setState('eReport')
			.doGet('/listReports')
			.subscribe(resp => {
					this.original = this.reports = resp['list'].map(report => {
						if (report.interval.frequency === 'Daily')
							for (let i = 0, len = report.template.subSections.length; i < len; i++)
								if (report.template.subSections[i].title.indexOf(report.template.title) !== -1)
									report.template.subSections[i].title = report.template.subSections[i].title.substring(report.template.title.length + 3);
						return report
					});
				}, () => {
					this.loading = false;
				}, () => {
					this.loading = false;
				}
			);
	}

	onclick(event) {
		if (this.viewType === 'view') {
			this.viewType = 'edit';
			this.temp = (event) ? event.selected[0] : {
				fresh: true,
				itemCategory: false,
				template: {subSections: []},
				interval: {
					frequency: "",
					days: {
						sunday: true,
						monday: true,
						tuesday: true,
						wednesday: true,
						thursday: true,
						friday: true,
						saturday: true
					}
				}
			};
			this.temp.original = this.temp;
			this.selected = (this.temp.template.subSections) ? [this.temp.template.subSections[0]] : [this.temp.template];
		} else if (this.viewType === 'edit') {
			this.selected = event.selected;
		}
	}

	submitReport() {
		console.log('Posting body:', this.temp);
		if (this.temp.template.title && this.temp.interval.frequency && (!this.temp.fresh || this.temp.itemCategory) && this.temp.template.subSections.length && this.temp.template.subSections[0].inputElements.length) {
			this.loading = true;
			if (this.temp.interval.frequency === 'Daily') this.temp.interval.days = {
				sunday: true,
				monday: true,
				tuesday: true,
				wednesday: true,
				thursday: true,
				friday: true,
				saturday: true
			};
			this.webService.doPost('/listReports', {report: this.temp})
				.subscribe(() => {
					this.toggle();
				}, () => {
				}, () => {
					this.loading = false;
				});
		} else
			console.log('missing a required field');
	}

	deleteReport() {

		if (this.temp.fresh || !this.temp.id || !this.temp.itemCategory)
			return;
		this.loading = true;
		this.webService.doDelete('/listReports', {id: this.temp.id, itemCategory: this.temp.itemCategory})
			.subscribe(() => {
				this.reports.splice(this.reports.indexOf(this.temp.original), 1);
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
				this.editing = i;
				return;
			}
		}
		this.editing = 0;
		this.selected = [emptySection];
		this.temp.template.subSections.unshift(emptySection);
	}

	removeSection(index) {
		if (this.temp.template.subSections[index] === this.selected[0]) this.selected = [];
		this.temp.template.subSections.splice(index, 1);
		this.temp.template.subSections = [...this.temp.template.subSections];
	}

	add() {
		this.selected[0].inputElements.push({caption: "", type: ""},);
	}

	remove(row) {
		this.selected[0].inputElements.splice(row, 1);
	}

	toggle() {
		delete this.temp;
		this.viewType = 'view';
		this.reports = this.original;
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
}
