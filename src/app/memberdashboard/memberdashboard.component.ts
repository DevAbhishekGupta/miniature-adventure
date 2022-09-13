import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    let memberId = this.route.snapshot.params['memberId'];
    this.loggedInUser = localStorage.getItem('username');
    this.getMemberDetails();
    this.getMember();
  }

  @ViewChild(MatTable) table: MatTable<any> | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
  }

  loggedInUser : string | any;

  displayedColumns: string[] = ['memberId','firstName','lastName','physician','claimId','claimAmount','submittedDate', 'submitClaim'];
  dataSource = new MatTableDataSource();

  finMemberId : number | any;

  editMember   : boolean | any = false;
  //findMember  : boolean | any = false;
  searchMemberTable   : boolean | any = true;
  addClaimForm    : boolean | any = false;

  memberForm: FormGroup | any;
  
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
    this.memberService.updateMember(this.member).subscribe(data => {
      this.member = data;
    }, error => {
      console.log(error);      
    });

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

    //this.searchMember = member;
    //console.log("claim member: " + member.memberId);
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

}
