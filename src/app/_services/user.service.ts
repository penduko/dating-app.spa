import { Injectable } from '@angular/core';
import { User } from '../_models/User';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { PaginatedResult, Pagination } from '../_models/pagination';
import { Message } from '../_models/message';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: HttpClient) {}

  getUsers(page?, itemsPerPage?, userParams?: any, likesParam?: string) {
    // create new instance of PaginatedResult to return
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    // initialize HttpParams to be
    // used as parameter in the query
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      // pagination filter
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (likesParam === 'likers') {
      // user likers filter
      params = params.append('likers', 'true');
    }

    if (likesParam === 'likees') {
      // user likees filter
      params = params.append('likees', 'true');
    }

    if (userParams != null) {
      // user filter
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    // use auth0/angular-jwt to request authentication
    return (
      this.authHttp
        // observe: 'response' will return the full reponse back
        // instead of the body
        // supply User of array the type of what were returning
        // instead of an object
        .get<User[]>(this.baseUrl + 'users', { observe: 'response', params })
        .pipe(
          map(response => {
            paginatedResult.result = response.body;

            // check if theres anything in the header with Pagination as headers
            if (response.headers.get('Pagination') != null) {
              paginatedResult.pagination = JSON.parse(
                response.headers.get('Pagination')
              );
            }

            return paginatedResult;
          })
        )
    );
  }

  getUser(id): Observable<User> {
    // use auth0/angular-jwt to request authentication
    return this.authHttp.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this.authHttp.put(this.baseUrl + 'users/' + id, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.authHttp.post(
      this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain',
      {}
    );
  }

  deletePhoto(userId: number, id: number) {
    return this.authHttp.delete(
      this.baseUrl + 'users/' + userId + '/photos/' + id
    );
  }

  sendLike(userId: number, recipientId: number) {
    return this.authHttp.post(
      this.baseUrl + 'users/' + userId + '/like/' + recipientId,
      {}
    );
  }

  getMessages(userId: number, page?, itemsPerPage?, messageContainer?: string) {
    // create new instance of PaginatedResult to return
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    // initialize HttpParams to be
    // used as parameter in the query
    let params = new HttpParams();
    params = params.append('messageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      // pagination filter
      params = params.append('pageSize', itemsPerPage);
      params = params.append('pageNumber', page);
    }

    // use auth0/angular-jwt to request authentication
    return this.authHttp
      .get<Message[]>(this.baseUrl + 'users/' + userId + '/messages', {
        observe: 'response',
        params
      })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;

          // check if theres anything in the header with Pagination as headers
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }

          return paginatedResult;
        })
      );
  }

  getMessageThread(userId: number, recipientId: number) {
    return this.authHttp.get<Message[]>(
      this.baseUrl + 'users/' + userId + '/messages/thread/' + recipientId
    );
  }

  sendMessage(userId: number, message: Message) {
    return this.authHttp.post<Message>(
      this.baseUrl + 'users/' + userId + '/messages',
      message
    );
  }

  deleteMessage(userId: number, id: number) {
    return (
      this.authHttp
        // using post we need send an object in the body
        .post(this.baseUrl + 'users/' + userId + '/messages/' + id, {})
        .pipe(
          // return no content we don't need to
          // map anything
          map(response => {})
        )
    );
  }

  markAsread(userId: number, id: number) {
    return (
      this.authHttp
        // using post we need send an object in the body
        .post(
          this.baseUrl + 'users/' + userId + '/messages/' + id + '/read',
          {}
        )
        .pipe(
          // return no content we don't need to
          // map anything
          map(() => {})
          // subscribe within the service itself
        )
        .subscribe()
    );
  }
}
