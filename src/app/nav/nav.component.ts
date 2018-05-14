import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;

  constructor(private authServices: AuthService, private alertify: AlertifyService, private router: Router) {}

  ngOnInit() {
    // using the subscribe method we get the current photo from the auth service
    this.authServices.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }

  login() {
    this.authServices.login(this.model).subscribe(data => {
      this.alertify.success('logged in succesfully');
    }, error => {
      this.alertify.error('failed to login');
    }, () => {
      this.router.navigate(['/members']);
    });
  }

  logout() {
    // set the token string and current user to null
    this.authServices.userToken = null;
    this.authServices.currentUser = null;
    // remove also from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.alertify.message('logout');
    // redirect to home page
    this.router.navigate(['/home']);
  }

  loggedIn() {
    return this.authServices.loggedIn();
  }
}
