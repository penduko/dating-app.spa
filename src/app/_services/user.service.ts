import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../_models/User';
import { Observable } from 'rxjs/Observable';
import { RequestOptions, Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) {}

  getUsers(): Observable<User[]> {
    // use angular2-jwt to request authentication
    return this.authHttp
      .get(this.baseUrl + 'users')
      .map(response => <User[]>response.json())
      .catch(this.handleError);
  }

  getUser(id): Observable<User> {
    // use angular2-jwt to request authentication
    return this.authHttp
      .get(this.baseUrl + 'users/' + id)
      .map(response => <User>response.json())
      .catch(this.handleError);
  }

  updateUser(id: number, user: User) {
    return this.authHttp
      .put(this.baseUrl + 'users/' + id, user)
      .catch(this.handleError);
  }

  setMainPhoto(userId: number, id: number) {
    return this.authHttp
      .post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {})
      .catch(this.handleError);
  }

  deletePhoto(userId: number, id: number) {
    return this.authHttp
      .delete(this.baseUrl + 'users/' + userId + '/photos/' + id)
      .catch(this.handleError);
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
