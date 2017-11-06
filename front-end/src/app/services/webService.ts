import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {AngularFireAuth} from "angularfire2/auth";

/*
 *  Service for web call (http and page state)
 */
@Injectable()
export class WebService {

	uid: string;
	state: string;
	baseUrl: string = 'https://us-central1-oviedofiresd-55a71.cloudfunctions.net';

	constructor(public afAuth: AngularFireAuth, public http: HttpClient) {
	}

	token() {
		return '?uid=' + this.getUID();
	}

	getUID() {
		return (this.uid === undefined) ? localStorage.getItem('uid') : this.uid;
	}

	login(email: string, password: string) {
		let self = this;
		this.afAuth.auth.signInWithEmailAndPassword(email, password).then(resp => {
			/* save uid token in browser */
			localStorage.setItem('uid', self.uid = resp.uid);
			/* if the user signed in isn't an administrator sign them out */
			this.doGet('/home').subscribe(() => {
			}, () => {
				localStorage.clear();
				delete this.uid;
				this.afAuth.auth.signOut();
				this.setState('403');
			}, () => {
			});
		}, error => {
			console.log(error);
			this.setState('401');
		});
	}

	logout() {
		this.afAuth.auth.signOut();
	}

	doGet(url: string, extra: string = '') {
		return this.http.get(this.baseUrl + url + this.token() + extra);
	}

	doPost(url: string, body, extra: string = '') {
		body.uid = this.getUID();
		return this.http.post(this.baseUrl + url + this.token() + extra, body, {responseType: 'text'});
	}

	doDelete(url: string, body) {
		body.uid = this.getUID();
		body = {body: body, responseType: 'text'};
		return this.http.delete(this.baseUrl + url, body);
	}

	getHome() {
		return this.http.get(this.baseUrl + '/home' + this.token());
	}

	/* TODO: remove this from webservices because it really isn't a web service*/
	setState(state: string) {
		this.state = state;
		return this;
	}

	checkState() {
		return this.state;
	}
}
