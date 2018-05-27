import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../_models/User';
import { Observable } from 'rxjs/Observable';
import { RequestOptions, Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AuthHttp } from 'angular2-jwt';
import { PaginatedResult } from '../_models/pagination';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) {}

  getUsers(page?: number, itemsPerPage?: number, userParams?: any, likesParam?: string) {
    // create new instance of PaginatedResult to return
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    // build our query string
    let qryString = '?';
    if (page != null && itemsPerPage != null) {
      // pagination filter
      qryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
    }

    if (likesParam === 'likers') {
      // user likers filter
      qryString += 'likers=true&';
    }

    if (likesParam === 'likees') {
      // user likees filter
      qryString += 'likees=true&';
    }

    if (userParams != null) {
      // user filter
      qryString +=
        'minAge=' + userParams.minAge +
        '&maxAge=' + userParams.maxAge +
        '&gender=' + userParams.gender +
        '&orderBy=' + userParams.orderBy;
    }

    // use angular2-jwt to request authentication
    return this.authHttp
      .get(this.baseUrl + 'users' + qryString)
      .map((response: Response) => {
        paginatedResult.result = response.json();

        // check if theres anything in the header with Pagination as headers
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
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

  sendLike(userId: number, recipientId: number) {
    return this.authHttp
      .post(this.baseUrl + 'users/' + userId + '/like/' + recipientId, {})
      .catch(this.handleError);
  }

  // method to handle error
  private handleError(error: any) {
    // handle status 400 error from the server
    if (error.status === 400) {
      // errors the comes out of the server
      // it is stored in _body of the reponse
      return Observable.throw(error._body);
    }

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
