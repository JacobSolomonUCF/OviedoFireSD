import {Component, ViewEncapsulation} from '@angular/core';

import {AngularFireAuth} from 'angularfire2/auth';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import {WebService} from "./services/webService";

@Component({
	selector: 'app-root',
	template: `
		<!doctype html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta name="description"
						content="A layout example with a side menu that hides on mobile, just like the Pure website.">
			<title>Oviedo Fire &ndash; Home Page</title>

			<link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css"
						integrity="sha384-nn4HPE8lTHyVtfCBi5yW9d20FjT8BJwUXyWZT9InLYax14RDjBj46LmSztkmNP9w" crossorigin="anonymous">
			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
		</head>


		<div id="login" *ngIf="(user | async)?.uid == undefined">
			<div
				style="background-color: #6c0505; color: white; text-align: center; font-size: 3em; padding-top: 5vh; padding-bottom: 5vh">
				<i class="fa fa-fire-extinguisher" style="border: 2px solid #EAEAEA;padding: 7px 8px;border-radius: 50%"></i>
				<span>&nbsp;Oviedo Fire</span>
			</div>
			<div class="alert alert-warning login centered" *ngIf="checkState() === '401'">The password is invalid or the user
				does not have a password.
			</div>
			<div class="alert alert-danger login centered" *ngIf="checkState() === '403'">Sorry but your account is not
				authorized
				to access the administrator's portal.
			</div>
			<form class="pure-form pure-form-aligned" style="text-align: center; padding-top: 5vh">
				<fieldset>
					<div class="pure-control-group">
						<label for="email">Email Address</label>
						<input #email id="email" type="email" placeholder="Email Address">
					</div>
					<div class="pure-control-group">
						<label for="password">Password</label>
						<input #password id="password" type="password" placeholder="Password">
					</div>
					<div class="pure-controls">
						<button type="submit" class="pure-button pure-button-primary"
										(click)="login(email.value, password.value)">
							Login
						</button>
					</div>
				</fieldset>
			</form>
		</div>

		<div id="layout" *ngIf="(user | async)?.uid">
			<div>
				<div id="menu" class>
					<div class="pure-menu">
						<a class="pure-menu-heading" uiSref="home">
							<i class="fa fa-fire-extinguisher"></i>&nbsp;Oviedo Fire
						</a>

						<ul class="pure-menu-list">
							<div class="pure-menu-scrollable" style="overflow: hidden">
								<li></li>
								<li class="pure-menu-item {{(this.checkState() === 'home') ? 'active' : ''}}">
									<a class="pure-menu-link"
										 uiSref="home">
										<i class="pure-u-1-8 fa fa-home"></i>
										<span class="pure-u-7-8">&nbsp;Home</span>
									</a>
								</li>
								<li class="pure-menu-item {{(this.checkState() === 'reports') ? 'active' : ''}}">
									<a uiSref="report" class="pure-menu-link">
										<i class="pure-u-1-8 fa fa-table"></i>
										<span class="pure-u-7-8">&nbsp;Reports</span>
									</a>
								</li>
								<li class="pure-menu-item {{(this.checkState() === 'statistics') ? 'active' : ''}}">
									<a uiSref="statistic" class="pure-menu-link">
										<i class="pure-u-1-8 fa fa-bar-chart"></i>
										<span class="pure-u-7-8">&nbsp;Statistics</span>
									</a>
								</li>
								<li class="pure-menu-item edit-tab {{!this.editList && this.editPage() ? 'active' : ''}}"
										(click)="this.editList = !this.editList">
									<a class="pure-menu-link" [ngSwitch]="this.editList">
										<i class="pure-u-1-8 fa fa-edit"></i>
										<span class="pure-u-3-4">&nbsp;Edit</span>
										<i class="pure-u-1-8 fa fa-chevron-down" *ngSwitchCase="true"></i>
										<i class="pure-u-1-8 fa fa-chevron-right" *ngSwitchDefault></i>
									</a>
								</li>
								<ul *ngIf="this.editList" class="fa-ul pure-menu-sub-list">
									<li class="pure-menu-item {{(this.checkState() === 'eReport') ? 'active' : ''}}">
										<a uiSref="eReport" class="pure-menu-link"><i class="fa fa-square small"></i>
											Reports</a>
									</li>
									<li class="pure-menu-item {{(this.checkState() === 'eUser') ? 'active' : ''}}">
										<a uiSref="eUser" class="pure-menu-link"><i class="fa fa-square small"></i>
											Users</a>
									</li>
								</ul>
								<li class="pure-menu-item {{(this.checkState() === 'extras') ? 'active' : ''}}">
									<a uiSref="extra" class="pure-menu-link">
										<i class="pure-u-1-8 fa fa-cogs"></i>
										<span class="pure-u-7-8">&nbsp;Extras</span>
									</a>
								</li>
								<li class="pure-menu-item edit-tab" (click)="logout()">
									<a uiSref="logout" class="pure-menu-link">
										<i class="pure-u-1-8 fa fa-power-off"></i>
										<span class="pure-u-7-8">&nbsp;Logout</span>
									</a>
								</li>
							</div>
						</ul>
					</div>
				</div>

				<div id="main">
					<ui-view></ui-view>
				</div>
			</div>
		</div>
	`,
	styleUrls: ['./menu.sass'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	user: Observable<firebase.User>;
	editList: boolean = false;

	constructor(public afAuth: AngularFireAuth, public webService: WebService) {
		this.user = this.afAuth.authState;
	}

	checkState() {
		return this.webService.checkState();
	}

	editPage() {
		let state = this.checkState();
		return state && state[0] === 'e'
	}

	login(email, password) {
		this.webService.login(email, password);
	}

	logout() {
		this.webService.logout();
	}
}
