import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../login/user';

@Injectable({
  providedIn: 'root'
})
export class RegisteruserService {

  constructor(private http: HttpClient) { }

  //private REGISTER_USER : string = `http://localhost:8080/user/api/registerUser`;

  //private REGISTER_USER : string = `http://ec2-54-68-150-84.us-west-2.compute.amazonaws.com:5000/user/api/registerUser`;

  private REGISTER_USER : string = `https://umxjd8fde7.execute-api.us-west-2.amazonaws.com/HCMP/registeruser`;


  registeruser(user : User) : Observable<User>{
    return this.http.post<User>(this.REGISTER_USER,user);
  }
  
}
