import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Claim } from '../model/claim';
import { Member } from '../model/member';
import { AuthService } from '../service/auth.service';
import { ClaimService } from '../service/claim.service';
import { MemberService } from '../service/member.service';

@Component({
  selector: 'app-memberdashboard',
  templateUrl: './memberdashboard.component.html',
  styleUrls: ['./memberdashboard.component.css']
})
export class MemberdashboardComponent implements OnInit {

  constructor(private router : Router,
    private authService : AuthService,
    private memberService : MemberService,
    private datePipe: DatePipe,
    private claimService : ClaimService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    let memberId = this.route.snapshot.params['memberId'];
    this.loggedInUser = localStorage.getItem('username');
    this.getMemberDetails();
    this.getMember();
    this.memberClaimFormValidation();
    this.getMemberId();
    this.updateMemberFormValidation();
  }

  @ViewChild(MatTable) table: MatTable<any> | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }

  loggedInUser : string | any;

  displayedColumns: string[] = ['memberId','firstName','lastName','physician','claimId','claimAmount','submittedDate'];
  dataSource = new MatTableDataSource();

  findMemberId : number | any;

  setMemberId : number | any;

  editMember   : boolean | any = false;
  //findMember  : boolean | any = false;
  searchMemberTable   : boolean | any = true;
  addClaimForm    : boolean | any = false;

  memberForm: FormGroup | any;
  memberClaimForm : FormGroup | any;
  updateMemberForm : FormGroup | any;
  
  searchMember  : Member = new Member();
  member  : Member = new Member();
  members : Array<Member> = [];
  data    : {} | any;

  claim : Claim = new Claim();
  claims : Array<Claim> = [];

  physicianSelected = 1;
  claimTypeSelected : string | any = "Vision";
  claimid : string | any;

  //ngEditDetailsForm   : boolean | any = true;


  ngEditDetails(){
    this.editMember = true;
    this.addClaimForm = false;
    this.searchMemberTable = false;
    console.log("inside ngAddMember");
    
  }

  editMemberForm(){
    debugger;
    console.log("inside editMemberForm");
    console.log("token: " + localStorage.getItem("token"));
    
    console.log(" this.member.memberId" + this.member.memberId);
    this.member.dob = this.datePipe.transform(this.member.dob,'MM/dd/yyyy');
    this.memberService.updateMember(this.member).subscribe(data => {
      this.member = data;
      alert("Member Details Updated Successfully.");
      Object.keys(this.updateMemberForm.controls).forEach(key => {
        this.updateMemberForm.get(key).setErrors(null) ;
      });
    }, error => {
      console.log(error);  
      Object.keys(this.updateMemberForm.controls).forEach(key => {
        this.updateMemberForm.get(key).setErrors(null) ;
      });    
    });

    this.member = new Member();

  }

  getMemberDetails(){
    let userID : string | any  = localStorage.getItem('userid');
    let userid = parseInt(userID);
    //console.log("localStorage: " +localStorage.getItem('userid'));
    //console.log("token: " +localStorage.getItem('token'));
    //console.log("userID: " +userID);
    //console.log("userid: " +userid);
    this.memberService.getMemberDetails(userid).subscribe(data => {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
      console.log("memberid: " + data);
      
    });
  }

  getMember(){
    let userID : string | any  = localStorage.getItem('userid');
    let userid = parseInt(userID);
    this.memberService.getMemberByUserId(userid).subscribe(data => {
      this.member = data;
    }, error => {
      console.log(error);
      
    });
    this.member = new Member();
  }

  claimForm(){
    this.editMember = false;
    this.addClaimForm = true;
    this.searchMemberTable = false;
    console.log("setMemberId: " + this.setMemberId);
    
    //this.searchMember = member;
    //console.log("claim member: " + member.memberId);
  }


  claimSubmit(){
    console.log("setMemberId: " + this.setMemberId);
    //this.claim.fkMemberId = this.searchMember.memberId;
    this.claim.fkMemberId = this.setMemberId;
    this.claim.claimType = this.claimTypeSelected;
    this.claim.claimDate = this.datePipe.transform(this.claim.claimDate,'MM/dd/yyyy');
    this.claimService.claimSubmit(this.claim).subscribe(data => {
      this.data = JSON.stringify(data);
      console.log("Added Data to the DB");
      alert("Added data to backend DB.");
      this.claims.push(this.data);
      this.clearClaimForm();
      Object.keys(this.memberClaimForm.controls).forEach(key => {
        this.memberClaimForm.get(key).setErrors(null) ;
      });
    },error => {
      console.log(error);
      this.clearClaimForm();
      Object.keys(this.memberClaimForm.controls).forEach(key => {
        this.memberClaimForm.get(key).setErrors(null) ;
      });
    });
    //this.clearClaimForm();
  }

  getMemberId(){
    //debugger;
    let userID : string | any  = localStorage.getItem('userid');
    let userid = parseInt(userID);
    console.log("getMemberId: " + this.setMemberId);
    this.memberService.getMemberId(userid).subscribe(data => {
      console.log("data:"+data);
      
      this.setMemberId = data;
    });
    console.log("getMemberId: " + this.setMemberId);
    
  }


  cancel(){
    this.searchMemberTable = true;
    this.addClaimForm = false;
    this.editMember = false;
  }



  logout(){
    console.log("Inside AppComponent.");
    
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  memberClaimFormValidation(){
    this.memberClaimForm = new FormGroup({
      claimType: new FormControl(this.claimTypeSelected, [Validators.required]),
      claimAmount: new FormControl(this.claim.claimAmount, [Validators.required]),
      claimDate: new FormControl(this.claim.claimDate, [Validators.required,ValidateClaimDate]),
      remarks: new FormControl(this.claim.remarks, [Validators.maxLength(1000)]),
    });
  }

  updateMemberFormValidation(){
    this.updateMemberForm = new FormGroup({
      firstName: new FormControl(this.member.firstName, [Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
      lastName: new FormControl(this.member.lastName, [Validators.required,Validators.minLength(5),Validators.maxLength(20)]),
      address: new FormControl(this.member.address, [Validators.required,Validators.minLength(10),Validators.maxLength(100)]),
      state: new FormControl(this.member.state, [Validators.required]),
      city: new FormControl(this.member.city, [Validators.required]),
      email: new FormControl(this.member.email, [Validators.required, Validators.email, 
        //isEmailPresent(this.memberService)
      ]),
      dob: new FormControl(this.member.dob, [Validators.required])
      
    });
  }

  public myError = (controlName: string, errorName: string) =>{
    //debugger;
    let hasErrorV : any = this.updateMemberForm.controls[controlName].hasError(errorName);
    
    return hasErrorV;
  }

  public claimError = (controlName: string, errorName: string) =>{
    
    return this.memberClaimForm.controls[controlName].hasError(errorName);
    
  }

  clearClaimForm(){
    this.memberClaimForm.reset();
    //this.claim.claimAmount = null;
    //this.claim.claimDate = null;
    //this.claim.remarks = null;
  }

}

function ValidateClaimDate(control: AbstractControl): ValidationErrors | null  {
    
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
  
  
}

function isEmptyInputValue(value: any): boolean {
  return value == null ||
      ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
}
