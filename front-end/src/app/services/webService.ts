import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {AngularFireAuth} from "angularfire2/auth";

@Injectable()
export class WebService {

	uid: string;
	baseUrl = 'https://us-central1-oviedofiresd-55a71.cloudfunctions.net';
	state: string;

	constructor(public afAuth: AngularFireAuth, public http: HttpClient) {
	}

	token() {
		return '?uid=' + this.getUID();
	}

	getUID() {
		return (this.uid === undefined) ? localStorage.getItem('uid') : this.uid;
	}

	login(email, password) {
		let self = this;
		this.afAuth.auth.signInWithEmailAndPassword(email, password).then(resp => {
			localStorage.setItem('uid', self.uid = resp.uid);
			this.doGet('/home').subscribe(() => {
			}, () => {
				localStorage.clear();
				delete this.uid;
				this.afAuth.auth.signOut();
				console.log('look', this.getUID());
				this.setState('403');
			}, () => {
			});
			// return resp.uid;
		}, error => {
			console.log(error);
			this.setState('401');
		});
	}

	logout() {
		this.afAuth.auth.signOut();
	}

	doGet(url, extra = '') {
		return this.http.get(this.baseUrl + url + this.token() + extra);
	}

	doPost(url, body) {
		body.uid = this.getUID();
		return this.http.post(this.baseUrl + url, body, {responseType: 'text'});
	}

	doDelete(url, body) {
		body.uid = this.getUID();
		body = {body: body, responseType: 'text'};
		return this.http.delete(this.baseUrl + url, body);
	}

	getHome() {
		return this.http.get(this.baseUrl + '/home' + this.token());
	}

	// TODO: remove this from webservices because it really isnt a web service
	setState(state: string) {
		this.state = state;
		return this;
	}

	checkState() {
		return this.state;
	}
}
