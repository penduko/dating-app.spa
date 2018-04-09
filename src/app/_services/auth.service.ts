import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
    baseUrl = 'http://localhost:5000/api/auth/';
    userToken: any;

constructor(private http: Http) { }

login(model: any) {
    // post our model and store the return token in browser local storage
    return this.http.post(this.baseUrl + 'login', model, this.requestOptions()).map((response: Response) => {
        const user = response.json();

        // check if there's anything in our user object
        if (user) {
            // store the token
            localStorage.setItem('token', user.tokenString);
            this.userToken = user.tokenString;
        }
    });
}

register(model: any) {
    // post our model
    return this.http.post(this.baseUrl + 'register', model, this.requestOptions());
}

requestOptions() {
    // specify the type of request
    const headers = new Headers({'Content-type': 'application/json'});
    return new RequestOptions({headers: headers});
}

}
