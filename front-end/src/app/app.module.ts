/* base functions */
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatDatepickerModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
/* login functionality */
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth'
import {AngularFireDatabaseModule} from 'angularfire2/database'
/* http request */
import {WebService} from "./services/webService";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
/* page switching */
import {UIRouterModule} from '@uirouter/angular';
import {AppComponent} from './app.component';
/* imported table structure */
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
/* pages */
import {Home} from "./pages/home";
import {Report} from "./pages/report";
import {Statistic} from "./pages/statistic";
import {EditUser} from './pages/edit/editUser';
import {EditReport} from './pages/edit/editReport';
import {Extra} from "./pages/extra";
/* charts */
import {ChartsModule} from "ng2-charts/ng2-charts";
/* imported datepicker (seen on reports page) */
import {Datepicker} from "./utils/datepicker";
/* imported qr creator and custom qr downloader */
import {QRCodeModule} from "angular2-qrcode";
import {QR} from "./utils/qr";

/* Initialize Firebase */
export const firebaseConfig = {
	apiKey: "AIzaSyDiF2EZj3ljA0Jrwafuq67de4ptk1r_usE",
	authDomain: "oviedofiresd-55a71.firebaseapp.com",
	databaseURL: "https://oviedofiresd-55a71.firebaseio.com",
	storageBucket: "oviedofiresd-55a71.appspot.com",
	messagingSenderId: "514772607400"
};

/** States */
let states = [
	{name: 'home', url: '', component: Home},
	{name: 'report', url: '/reports', component: Report},
	{name: 'eReport', url: '/report', component: EditReport},
	{name: 'eUser', url: '/users', component: EditUser},
	{name: 'statistic', url: '/statistics', component: Statistic},
	{name: 'extra', url: '/extras', component: Extra}
];

@NgModule({
	declarations: [AppComponent, Home, Report, EditReport, EditUser, Statistic, Extra, Datepicker, QR],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		UIRouterModule.forRoot({states: states, useHash: true}),
		FormsModule,
		ChartsModule,
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		HttpClientModule,
		NgxDatatableModule,
		MatDatepickerModule,
		BrowserModule,
		HttpModule,
		MatDatepickerModule,
		MatInputModule,
		MatNativeDateModule,
		QRCodeModule
	],
	providers: [WebService],
	bootstrap: [AppComponent],
	entryComponents: [],
	exports: []
})
export class AppModule {
}

