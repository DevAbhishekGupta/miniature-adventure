import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }

  private LOGIN_USER : string = `http://localhost:8080/auth/api/loginUser`;

  map : Map<string,string> | any;

  

  loginUser(user : User):Observable<Map<string,string>>
  {
    let jsn = {
      "username"      : user.username,
      "password"   : user.password
    };

    //console.log("inside user service login");
    //console.log("Username service : " + jsn.username);
    //console.log("password service : " + jsn.password);
    //console.log("Username: " + user.username);
    //console.log("password: " + user.password);
    this.map = this.http.post<Map<string,string>>(this.LOGIN_USER,jsn);
      return this.map;
  }

}
