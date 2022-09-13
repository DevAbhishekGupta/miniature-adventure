import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../login/user';
import { RegisteruserService } from './registeruser.service';

@Component({
  selector: 'app-registeruser',
  templateUrl: './registeruser.component.html',
  styleUrls: ['./registeruser.component.css']
})
export class RegisteruserComponent implements OnInit {

  constructor(private registerUserService : RegisteruserService,
    private router : Router) { }

  ngOnInit(): void {

    this.registerForm = new FormGroup({
      username: new FormControl(this.user.username, [Validators.required]),
      password: new FormControl(this.user.password, [Validators.required, 
        Validators.minLength(8),Validators.maxLength(15),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$")])
    });

  }

  user : User = new User();
  roleSelected = 'M';

  registerForm : FormGroup | any;

  

  
  registerUser(){
    this.user.role = this.roleSelected;
    this.registerUserService.registeruser(this.user).subscribe(data => {
      alert("User Registration Successfully.")
      this.router.navigate(['/login']);
    }, error => {
      console.log(error);
      
    })
  }


  public myError = (controlName: string, errorName: string) =>{
    return this.registerForm.controls[controlName].hasError(errorName);
  }


}
