
import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";

import {AngularFireAuth} from "angularfire2/auth";
import {AngularFireDatabase} from "angularfire2/database";

@Injectable()
export class WebService {

  baseUrl = 'https://us-central1-oviedofiresd-55a71.cloudfunctions.net';
  uid: String;

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase, public http: HttpClient) {}

  getUID() {
    return this.uid;
  }

  login(email, password) {
    let self = this;
    //console.log(this.afAuth.auth.createUserWithEmailAndPassword(email, password));
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(function (x) {
      self.uid = x.uid;
      return x.uid;
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  getHome() {
    return this.http.get(this.baseUrl + '/home?uid=' + this.getUID());
  }
}
