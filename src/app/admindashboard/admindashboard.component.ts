import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Claim } from '../model/claim';
import { Member } from '../model/member';
import { AuthService } from '../service/auth.service';
import { ClaimService } from '../service/claim.service';
import { MemberService } from '../service/member.service';

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
    private claimService : ClaimService) { }

  ngOnInit(): void {
  }

  @ViewChild(MatTable) table: MatTable<any> | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  //@ViewChild(MatSort) sort: MatSort | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    
  }

  displayedColumns: string[] = ['memberId','firstName','lastName','physician','claimId','claimAmount','submittedDate', 'submitClaim'];
  dataSource = new MatTableDataSource();

  addMember   : boolean | any = true;
  findMember  : boolean | any = false;
  searchMemberTable   : boolean | any = false;
  addClaimForm    : boolean | any = false;

  memberForm: FormGroup | any;
  
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
    this.addMember = false;

    this.searchMember = member;
    console.log("claim member: " + member.memberId);
  }

  ngFindMember(){
    this.searchMember = new Member();
    console.log("this.ngFindMember: " + this.findMember);
    this.findMember = true;
    this.searchMemberTable = false;
    this.addMember = false;
    this.addClaimForm = false;
    this.claimid = null;
    this.searchPhysician = null;
    console.log("inside ngFindMember");
    console.log("this.ngFindMember: " + this.findMember);
    
  }


  ngAddMember(){
    console.log("this.addMember: " + this.addMember);
    this.findMember = false;
    this.searchMemberTable = false;
    this.addMember = true;
    console.log("inside ngAddMember");
    console.log("this.addMember: " + this.addMember);
    
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
    });
  }

  memberSearch(){
    console.log("memberSearch");
    console.log("this.searchMember.memberId: " + this.searchMember.memberId);
    console.log("this.searchMember.firstName: " + this.searchMember.firstName);
    console.log("this.searchMember.lastName: " +this.searchMember.lastName);
    console.log("this.claimid: " + this.claimid);
    console.log("this.searchPhysician: " +this.searchPhysician);
    
    if(this.searchMember.memberId != null && this.searchMember.firstName == null 
      && this.searchMember.lastName == null && this.claimid ==null && this.searchPhysician ==null){
        console.log("if 1");
      this.searchByMemberId();
    }
    if(this.searchMember.firstName != null && this.searchMember.lastName != null && this.claimid ==null
      && this.searchPhysician ==null && this.searchMember.memberId == null){
        console.log("if 2");
      this.searchByMemberName();
    }

    if(this.searchPhysician !=null && this.searchMember.memberId == null && this.searchMember.firstName == null 
      && this.searchMember.lastName == null && this.claimid ==null){
        console.log("if 3");
        this.searchByPhysician();
      }

    if(this.claimid !=null && this.searchPhysician ==null && this.searchMember.memberId == null 
      && this.searchMember.firstName == null && this.searchMember.lastName == null ){
        console.log("if 4");
          this.searchMemberByClaimId();
    }
  }

  searchByMemberId(){
    this.memberService.searchByMemberId(this.searchMember.memberId).subscribe(data => {
      this.searchMemberTable = true;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
    });
  }

  searchByMemberName(){
    console.log("searchByMemberName");
    this.memberService.searchByMemberName(this.searchMember.firstName, this.searchMember.lastName).subscribe(data => {
      this.searchMemberTable = true;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
    });
  }

  searchByPhysician(){
    this.memberService.searchByPhysician(this.physicianSelected).subscribe(data => {
      this.searchMemberTable = true;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
    });
  }

  searchMemberByClaimId(){
    console.log("searchMemberByClaimId: "+this.claimid);
    
    this.memberService.memberDetailsByClaimId(this.claimid).subscribe(data => {
      this.searchMemberTable = true;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
    });
  }

  registerMember(){
    console.log("DOB: "+ this.member.dob);
    console.log("DOB: "+ this.datePipe.transform(this.member.dob,'MM/dd/yyyy'));
    this.member.dob = this.datePipe.transform(this.member.dob,'MM/dd/yyyy');
    //this.member.fkUserId = localStorage.getItem("userid");
    this.memberService.registerMember(this.member).subscribe(data => {
      this.data = JSON.stringify(data);
      console.log("Added Data to the DB");
      alert("Added data to backend DB.");
      this.members.push(this.data);
    }, error => {
      console.log(error);
      
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

}
