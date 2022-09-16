import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  //private ISUSEREXIST : string = `http://localhost:8080/user/api/isUserExist`;

  private ISUSEREXIST : string = `http://ec2-54-68-150-84.us-west-2.compute.amazonaws.com:5000/user/api/isUserExist`;

  isUserExist(userName : string ) : boolean | any {
    return this.http.get<boolean>(`${this.ISUSEREXIST}/${userName}`);
  }

}
