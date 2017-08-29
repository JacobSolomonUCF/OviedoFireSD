import {Component, ViewEncapsulation} from '@angular/core';

import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database'
import {AngularFireAuth} from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./menu.sass'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  user: Observable<firebase.User>;
  items: FirebaseListObservable<any[]>;
  msgVal: string = '';

  constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {
    this.items = af.list('/messages', {
      query: {
        limitToLast: 50
      }
    });

    this.user = this.afAuth.authState;
    console.log(this.user);
  }

  login(email, password) {
    //console.log(this.afAuth.auth.createUserWithEmailAndPassword(email, password));
    console.log(email, password);
    console.log(this.afAuth.auth.signInWithEmailAndPassword(email, password));;
    console.log(this.afAuth.authState);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  Send(desc: string) {
    this.items.push({ message: desc});
    this.msgVal = '';
  }

  apicalltemplate() {
    'https://us-central1-oviedofiresd-55a71.cloudfunctions.net/' + 'listUsers?uid';
    var parms:any = { uid: this.user };

  }
}
