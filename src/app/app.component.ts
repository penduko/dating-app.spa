import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // get the token string from local storage
    // so that we can get the username and display to the user
    // even if page is refresh
    const token = localStorage.getItem('token');
    // get also the user from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }

    if (user) {
      this.authService.currentUser = user;
      // change the current photo url to keep updated 
      this.authService.changeMemberPhoto(user.photoUrl);
    }
  }
}
