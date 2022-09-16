import { DatePipe, DATE_PIPE_DEFAULT_TIMEZONE } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from '../login/user';
import { Claim } from '../model/claim';
import { Member } from '../model/member';
import { AuthService } from '../service/auth.service';
import { ClaimService } from '../service/claim.service';
import { MemberService } from '../service/member.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {

  constructor(private router : Router,
    private authService : AuthService,
    private memberService : MemberService,
    private datePipe: DatePipe,
    private claimService : ClaimService,
    private userService : UserService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.memberFormValidation();
    this.memberClaimFormValidation();

  }

  @ViewChild(MatTable) table: MatTable<any> | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }

  displayedColumns: string[] = ['memberId','firstName','lastName','physician','claimId','claimAmount','submittedDate', 'submitClaim'];
  dataSource = new MatTableDataSource();

  addMember   : boolean | any = true;
  findMember  : boolean | any = false;
  searchMemberTable   : boolean | any = false;
  addClaimForm    : boolean | any = false;
  noRecordFound   : boolean | any = false;

  isUserExist : boolean = false;

  memberForm: FormGroup | any;
  memberClaimForm : FormGroup | any;
  
  searchMember  : Member = new Member();
  member  : Member = new Member();
  members : Array<Member> = [];
  data    : {} | any;

  claim : Claim = new Claim();
  claims : Array<Claim> = [];

  physicianSelected = 1;
  searchPhysician : number | any;
  claimTypeSelected : string | any = "Vision";
  claimid : string | any;

  claimForm(member : Member){
    this.addClaimForm = true;
    this.findMember = false;
    this.searchMemberTable = false;
    this.noRecordFound =false;
    this.addMember = false;

    this.searchMember = member;

    this.claim = new Claim();
    console.log("claim member: " + member.memberId);
  }

  ngFindMember(){
    this.searchMember = new Member();
    console.log("this.ngFindMember: " + this.findMember);
    this.findMember = true;
    this.searchMemberTable = false;
    this.noRecordFound = false;
    this.addMember = false;
    this.addClaimForm = false;
    this.claimid = null;
    this.searchPhysician = 0;
    console.log("inside ngFindMember");
    console.log("this.ngFindMember: " + this.findMember);
    
  }


  ngAddMember(){
    this.findMember = false;
    this.searchMemberTable = false;
    this.noRecordFound = false;
    this.addMember = true;
    this.addClaimForm = false;
    this.member = new Member();
    
  }

  claimSubmit(){
    this.claim.fkMemberId = this.searchMember.memberId;
    this.claim.claimType = this.claimTypeSelected;
    this.claim.claimDate = this.datePipe.transform(this.claim.claimDate,'MM/dd/yyyy');
    this.claimService.claimSubmit(this.claim).subscribe(data => {
      this.data = JSON.stringify(data);
      console.log("Added Data to the DB");
      alert("Added data to backend DB.");
      this.claims.push(this.data);
      Object.keys(this.memberClaimForm.controls).forEach(key => {
        this.memberClaimForm.get(key).setErrors(null) ;
      });
    },error => {
      console.log(error);
      Object.keys(this.memberClaimForm.controls).forEach(key => {
        this.memberClaimForm.get(key).setErrors(null) ;
      });
    });
    
  }

  memberSearch(){
    debugger;
    console.log("memberSearch");
    console.log("this.searchMember.memberId: " + this.searchMember.memberId);
    console.log("this.searchMember.firstName: " + this.searchMember.firstName);
    console.log("this.searchMember.lastName: " +this.searchMember.lastName);
    console.log("this.claimid: " + this.claimid);
    console.log("this.searchPhysician: " +this.searchPhysician);
    
    if(this.searchMember.memberId != null 
      //&& this.searchMember.firstName == null 
      //&& this.searchMember.lastName == null && this.claimid ==null && this.searchPhysician ==null
      ){
        console.log("if 1");
      this.searchByMemberId();
    }
    else if(this.searchMember.firstName != null && this.searchMember.lastName != null 
      //&& this.claimid ==null && this.searchPhysician ==null && this.searchMember.memberId == null
      ){
        console.log("if 2");
      this.searchByMemberName();
    }
    else if(this.claimid !=null 
      //&& this.searchPhysician ==null && this.searchMember.memberId == null 
      //&& this.searchMember.firstName == null && this.searchMember.lastName == null 
      ){
        console.log("if 3");
          this.searchMemberByClaimId();
    }

    else if ((this.searchPhysician > 0) && (this.searchPhysician < 9 )
      //&& this.searchMember.memberId == null && this.searchMember.firstName == null 
      //&& this.searchMember.lastName == null && this.claimid ==null
      ){
        console.log("if 4");
        this.searchByPhysician();
      }
      else{
        //alert("At least 1 input is required.");
        this.snackBar.open("At least 1 input is required.", "Ok", {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          panelClass: ['mat-toolbar', 'mat-primary']
        });
      }
      this.searchMember = new Member();
      this.claimid = null;
      this.searchPhysician = 0;

      /*
      if(!this.searchMemberTable){
        this.noRecordFound = true;
      }
      */

    
  }

  searchByMemberId(){
    debugger;
    this.memberService.searchByMemberId(this.searchMember.memberId).subscribe(data => {
      this.searchMemberTable = true;
      this.noRecordFound = false;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    }, error => {
      console.log(error);
      this.searchMemberTable = false;
      this.noRecordFound = true;
    });
  }

  searchByMemberName(){
    debugger;
    console.log("searchByMemberName");
    this.memberService.searchByMemberName(this.searchMember.firstName, this.searchMember.lastName).subscribe(data => {
      this.searchMemberTable = true;
      this.noRecordFound = false;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    }, error => {
      console.log(error);
      this.searchMemberTable = false;
      this.noRecordFound = true;
    });
  }

  searchByPhysician(){
    debugger;
    this.memberService.searchByPhysician(this.searchPhysician).subscribe(data => {
      this.searchMemberTable = true;
      this.noRecordFound = false;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
    }, error => {
      console.log(error);
      this.searchMemberTable = false;
      this.noRecordFound = true;
    });
  }

  searchMemberByClaimId(){
    debugger;
    console.log("searchMemberByClaimId: "+this.claimid);
    
    this.memberService.memberDetailsByClaimId(this.claimid).subscribe(data => {
      this.searchMemberTable = true;
      this.noRecordFound = false;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.noRecordFound =false;
    }, error => {
      console.log(error);
      this.searchMemberTable = false;
      this.noRecordFound = true;
    });
    
  }

  registerMember(){
    //console.log("DOB: "+ this.member.dob);
    //console.log("DOB: "+ this.datePipe.transform(this.member.dob,'MM/dd/yyyy'));
    //if(this.member.firstName == null && this.member.lastName && this.member.userName !=null)
    this.member.dob = this.datePipe.transform(this.member.dob,'MM/dd/yyyy');
    //this.member.fkUserId = localStorage.getItem("userid");
    this.memberService.registerMember(this.member).subscribe(data => {
      this.data = JSON.stringify(data);
      console.log("Added Data to the DB");
      alert("Added data to backend DB.");
      this.members.push(this.data);
      Object.keys(this.memberForm.controls).forEach(key => {
        this.memberForm.get(key).setErrors(null) ;
      });
      
    }, error => {
      console.log(error);
      Object.keys(this.memberForm.controls).forEach(key => {
        this.memberForm.get(key).setErrors(null) ;
      });
    });
    

    this.data = {};
    this.member = new Member();
    
  }

  cancel(){
    this.addMember = false;
    this.findMember = false;
    this.searchMemberTable = false;
    this.addClaimForm = false;
  }



  logout(){
    console.log("Inside AppComponent.");
    
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  clearMemberForm(){
    this.memberForm.reset();
    /*
    Object.keys(this.memberForm.controls).forEach(key => {
        this.memberForm.get(key).setErrors(null) ;
    });
    */
  }

  clearClaimForm(){
    this.memberClaimForm.reset();
    /*
    Object.keys(this.memberClaimForm.controls).forEach(key => {
      this.memberClaimForm.get(key).setErrors(null) ;
    });
    */
  }

  memberFormValidation(){
    this.memberForm = new FormGroup({
      firstName: new FormControl(this.member.firstName, [Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
      lastName: new FormControl(this.member.lastName, [Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
      userName: new FormControl(this.member.userName, [Validators.required, 
        //isUserPresent(this.userService)
      ]), 
      passWord: new FormControl(this.member.passWord, [Validators.required,  Validators.minLength(8),Validators.maxLength(15), 
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$")]),
      address: new FormControl(this.member.address, [Validators.required,Validators.minLength(10),Validators.maxLength(100)]),
      state: new FormControl(this.member.state, [Validators.required]),
      city: new FormControl(this.member.city, [Validators.required]),
      email: new FormControl(this.member.email, [Validators.required, Validators.email, 
        //isEmailPresent(this.memberService)
      ]),
      dob: new FormControl(this.member.dob, [Validators.required])
      
    });
  }

  memberClaimFormValidation(){
    this.memberClaimForm = new FormGroup({
      claimType: new FormControl(this.claimTypeSelected, [Validators.required]),
      claimAmount: new FormControl(this.claim.claimAmount, [Validators.required]),
      claimDate: new FormControl(this.claim.claimDate, [Validators.required,ValidateClaimDate]),
      remarks: new FormControl(this.claim.remarks, [Validators.maxLength(1000)]),
    });
  }

  public myError = (controlName: string, errorName: string) =>{
    //debugger;
    let hasErrorV : any = this.memberForm.controls[controlName].hasError(errorName);
    
    return hasErrorV;
  }

  public claimError = (controlName: string, errorName: string) =>{
    
    let hasErrorV : any = this.memberClaimForm.controls[controlName].hasError(errorName);
    return hasErrorV;
  }


}


//function ValidateClaimDate(control: AbstractControl): {[key: string]: any} | null  {
function ValidateClaimDate(control: AbstractControl): ValidationErrors | null  {
  //debugger;
  //console.log("control.value: "+ control.value);
  //let datePipe = new DatePipe('en');
  //let cDate = datePipe.transform(control.value,'MM/dd/yyyy');
  //console.log("claimdate: " + cDate);

  if (isEmptyInputValue(control.value)) {
    return null;
  }


  let currentDate = new Date();
  let claimDate = new Date(control.value);
  
  if(claimDate < currentDate){
    return { 'validateClaimDate': true }
  }else{
    return null;
  }
  
  
  /*
  if (control.value && control.value.length != 10) {
    return { 'phoneNumberInvalid': true };
  }
  */
  //return null;
  
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


function isEmailPresent(memberService : MemberService) : ValidatorFn {
  return (control: AbstractControl): ValidationErrors|null => {
    if (isEmptyInputValue(control.value)) {
      return null;
    }

  let isEmailExist : boolean = memberService.isEmailExist(control.value);

  if(isEmailExist){
    return { 'isEmailExist': 'Email is present.' }
  }else{
    return null;
  }
  };
}


/*
function isUserPresentValidator(control: AbstractControl): ValidationErrors | null  {
  //debugger;
  if (isEmptyInputValue(control.value)) {
    return null;
  }
  
  let isUserExist : boolean;
  UserService.isUserExist(control.value);

  userService : UserService = new UserService();

  if(control.value != null){
    this.userService.isUserExist(control.value).subscribe( data => {
      isUserExist = data;
    });
  }

  if(this.isUserExist){
    return { 'isUserExist': 'Username is present.' }
  }else{
    return null;
  }
  */