import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  userToken: any;
  decodedToken: any;
  jwtHelper: JwtHelper = new JwtHelper();
  currentUser: User;
  // use behaviorsubject for any to any component communications
  // behaviorsubject needs an initial value
  // use a placeholder image
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  // property that other component can subscribe
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor(private http: Http) {}

  changeMemberPhoto(photoUrl: string) {
    if (photoUrl == null) {
      this.photoUrl.next('../../assets/user.png');
    } else {
      this.photoUrl.next(photoUrl);
    }
  }

  login(model: any) {
    // post our model and store the return token in browser local storage
    return this.http
      .post(this.baseUrl + 'login', model, this.requestOptions())
      .map((response: Response) => {
        const user = response.json();

        // check if there's anything in our user object
        if (user && user.tokenString) {
          // store the token in localstorage
          localStorage.setItem('token', user.tokenString);
          // store the user in localstorage
          localStorage.setItem('user', JSON.stringify(user.user));

          this.currentUser = user.user;
          this.userToken = user.tokenString;

          // decode and get the username from token to display the user
          this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);

          // set currentPhotoUrl to photoUrl contained in current user object
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
      .catch(this.handleError);
  }

  register(user: User) {
    // post our model
    return this.http
      .post(this.baseUrl + 'register', user, this.requestOptions())
      .catch(this.handleError);
  }

  loggedIn() {
    // use angular2-jwt library to check if token is valid
    return tokenNotExpired();
  }

  requestOptions() {
    // specify the type of request
    const headers = new Headers({ 'Content-type': 'application/json' });
    return new RequestOptions({ headers: headers });
  }

  // method to handle error
  private handleError(error: any) {
    // get the application error from the header
    const applicationError = error.headers.get('Application-Error');
    if (applicationError) {
      // return the message return from the server
      return Observable.throw(applicationError);
    }

    // the model state error
    const serverError = error.json();
    let modelStateErrors = '';
    if (serverError) {
      // loop the keys from the server error
      for (const key in serverError) {
        if (serverError[key]) {
          // add to medel state errors
          modelStateErrors += serverError[key] + '\n';
        }
      }
    }

    return Observable.throw(modelStateErrors || 'Server error');
  }
}
