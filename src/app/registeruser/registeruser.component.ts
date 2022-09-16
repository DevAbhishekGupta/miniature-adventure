import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../login/user';
import { UserService } from '../service/user.service';
import { RegisteruserService } from './registeruser.service';

@Component({
  selector: 'app-registeruser',
  templateUrl: './registeruser.component.html',
  styleUrls: ['./registeruser.component.css']
})
export class RegisteruserComponent implements OnInit {

  constructor(private registerUserService : RegisteruserService,
    private router : Router,
    private userService : UserService) { }

  ngOnInit(): void {

    this.registerForm = new FormGroup({
      username: new FormControl(this.user.username, [Validators.required,
        //isUserPresent(this.userService)
      ]),
      password: new FormControl(this.user.password, [Validators.required, 
        Validators.minLength(8),Validators.maxLength(15),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$")]),
      selectRole : new FormControl(this.roleSelected, [Validators.required])
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

function isEmptyInputValue(value: any): boolean {
  return value == null ||
      ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
}


function isUserPresent(userService : UserService) : ValidatorFn {
  return (control: AbstractControl): ValidationErrors|null => {
    if (isEmptyInputValue(control.value)) {
      return null;
    }

    /*
    let isUserExist : boolean | any; 
    userService.isUserExist(control.value).subscribe(data => {
      isUserExist = data;
    });
    */
    let isUserExist : boolean | any = userService.isUserExist(control.value);

  if(isUserExist){
    return { 'isUserExist': 'Username is present.' }
  }else{
    return null;
  }
  };
}