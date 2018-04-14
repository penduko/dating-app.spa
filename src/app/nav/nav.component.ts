import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authServices: AuthService, private alertify: AlertifyService) {}

  ngOnInit() {
  }

  login() {
    this.authServices.login(this.model).subscribe(data => {
      this.alertify.success('logged in succesfully');
    }, error => {
      this.alertify.error(error);
    });
  }

  logout() {
    this.authServices.userToken = null;
    localStorage.removeItem('token');
    this.alertify.message('logout');
  }

  loggedIn() {
    return this.authServices.loggedIn();
  }
}
