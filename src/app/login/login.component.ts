import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { LoginService } from './login.service';
import { User } from './user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService : LoginService,
    private authService : AuthService,
    private router : Router) { }

  ngOnInit(): void {

    this.returnUrl = '/admin';  
    this.authService.logout(); 

    this.loginForm = new FormGroup({
      username: new FormControl(this.user.username, [Validators.required]),
      password: new FormControl(this.user.password, [Validators.required,
        Validators.minLength(8),Validators.maxLength(15), 
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$")])
    });
  }


  loginForm: FormGroup | any;
  
  user    : User = new User();
  data    : {} | any;
  message : string | any;
  returnUrl   : string | any;

  userLogin(){
    console.log("Username component: " + this.user.username);
    console.log("password component: " + this.user.password);
    this.loginService.loginUser(this.user).subscribe(data => {
      //this.data = JSON.stringify(data);
      this.data = JSON.parse(JSON.stringify(data));
      //console.log("User data: " + data);
      //console.log("User this.data: " + this.data);

      console.log("User map message: " + this.data.message);
    console.log("User map token: " + this.data.token);
    console.log("User map role: " + this.data.role);
    console.log("this.data.userid: " + this.data.userid);
    

    if(this.data.role === 'A'){
      this.returnUrl = '/admin'
    }

    if(this.data.role === 'M'){
      this.returnUrl = '/member'
    }

    let token = this.data.token;

    if(token != null){
      localStorage.setItem('isLoggedIn', "true");  
      localStorage.setItem('token', token); 
      localStorage.setItem('userid', this.data.userid);
      localStorage.setItem('username', this.data.username);
      this.router.navigate([this.returnUrl]);  
    }else{
      alert("Login Unsuccessful.");
    }
      
    }, error => {
      console.log(error);
      
    })
    this.user = new User();
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.loginForm.controls[controlName].hasError(errorName);
  }

}
