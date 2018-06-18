import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthUser } from '../_models/authUser';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  baseUrl = environment.apiUrl;
  userToken: any;
  decodedToken: any;
  currentUser: User;
  // use behaviorsubject for any to any component communications
  // behaviorsubject needs an initial value
  // use a placeholder image
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  // property that other component can subscribe
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) {}

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
      .post<AuthUser>(this.baseUrl + 'auth/login', model, {
        headers: new HttpHeaders().set('Content-type', 'application/json')
      })
      .map(user => {

        // check if there's anything in our user object
        if (user && user.tokenString) {
          // store the token in localstorage
          localStorage.setItem('token', user.tokenString);
          // store the user in localstorage
          localStorage.setItem('user', JSON.stringify(user.user));

          this.currentUser = user.user;
          this.userToken = user.tokenString;

          // decode and get the username from token to display the user
          this.decodedToken = this.jwtHelperService.decodeToken(
            user.tokenString
          );

          // set currentPhotoUrl to photoUrl contained in current user object
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      });
  }

  register(user: User) {
    // post our model
    return this.http
      .post(this.baseUrl + 'auth/register', user, {
        headers: new HttpHeaders().set('Content-type', 'application/json')
      });
  }

  loggedIn() {
    // grabs the token in our local storage
    const token = this.jwtHelperService.tokenGetter();

    // return false if theres no token
    if (!token) {
      return false;
    }

    return !this.jwtHelperService.isTokenExpired(token);
  }

}
