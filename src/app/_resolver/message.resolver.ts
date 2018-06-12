import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { AuthService } from '../_services/auth.service';
import { Message } from '../_models/message';

// because this is not a component
// we need to add the @Injectable decorator
// we dont need this in a component because component
// is a sub type of injectable
// we need to this so that we can inject this it a constructor
@Injectable()
export class MessageResolver implements Resolve<Message[]> {
  pageSize = 5;
  pageNumber = 1;
  messageContainer = 'Unread';

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router,
    private authService: AuthService
  ) {}

  // implement resolve method
  // use the ActiveRouteSnapshot the get the parameter from
  // the url
  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    // in the case of component we need to subscribe
    // because were returning Obeservable but the route resolver automatically
    // subscribe for us so we dont need to use it here
    return this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pageNumber,
        this.pageSize,
        this.messageContainer
      )
      .catch(error => {
        // incase of an error
        // notify the user
        this.alertify.error('Problem retrieving data');
        // redirect the user
        this.router.navigate(['/home']);
        // return null
        return Observable.of(null);
      });
  }
}
