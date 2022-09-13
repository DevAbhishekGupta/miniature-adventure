import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  logout() :void {    
    console.log("Inside Auth Service.");
    localStorage.setItem('isLoggedIn','false');    
    localStorage.removeItem('token');    
  }
}
