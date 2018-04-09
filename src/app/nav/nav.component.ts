import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authServices: AuthService) {}

  ngOnInit() {
  }

  login() {
    this.authServices.login(this.model).subscribe(data => {
      console.log('logged in succesfully');
    }, error => {
      console.log('failed to login');
    });
  }

  logout() {
    this.authServices.userToken = null;
    localStorage.removeItem('token');
    console.log('logout');
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    // return true if theres an item in the token
    // return false if none
    return !!token;
  }
}
