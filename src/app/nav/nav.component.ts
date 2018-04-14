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

  constructor(private authServices: AuthService, private alertify: AlertifyService, private router: Router) {}

  ngOnInit() {
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
    this.authServices.userToken = null;
    localStorage.removeItem('token');
    this.alertify.message('logout');
    this.router.navigate(['/home']);
  }

  loggedIn() {
    return this.authServices.loggedIn();
  }
}
