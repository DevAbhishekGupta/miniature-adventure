import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../login/user';

@Injectable({
  providedIn: 'root'
})
export class RegisteruserService {

  constructor(private http: HttpClient) { }

  private REGISTER_USER : string = `http://localhost:8080/user/api/registerUser`;

  registeruser(user : User) : Observable<User>{
    return this.http.post<User>(this.REGISTER_USER,user);
  }
  
}
