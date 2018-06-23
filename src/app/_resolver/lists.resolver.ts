import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// because this is not a component
// we need to add the @Injectable decorator
// we dont need this in a component because component
// is a sub type of injectable
// we need to this so that we can inject this it a constructor
@Injectable()
export class ListsResolver implements Resolve<User[]> {
  pageSize = 5;
  pageNumber = 1;
  likeParams = 'likers';

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  // implement resolve method
  // use the ActiveRouteSnapshot the get the parameter from
  // the url
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    // in the case of component we need to subscribe
    // because were returning Obeservable but the route resolver automatically
    // subscribe for us so we dont need to use it here
    return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likeParams)
      .pipe(
          catchError(error => {
          // incase of an error
          // notify the user
          this.alertify.error('Problem retrieving data');
          // redirect the user
          this.router.navigate(['/home']);
          // return null
          return of(null);
        })
      );
  }
}
