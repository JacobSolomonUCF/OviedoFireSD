import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {AngularFireAuth} from "angularfire2/auth";
import {RequestOptions} from "@angular/http";

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
      return resp.uid;
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  doGet(url) {
    return this.http.get(this.baseUrl + url + this.token());
  }

  doPost(url, body) {
    body.uid = this.getUID();
    return this.http.post(this.baseUrl + url, body);
  }

  doDelete(url, body) {
    body.uid = this.getUID();
    body = new RequestOptions({body: body});
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
