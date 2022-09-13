import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from '../model/member';
import { MemberDetails } from '../model/member-details';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http : HttpClient) { }

  private REGISTER_MEMBER : string = `http://localhost:8080/mem/api/addMember`;

  private SEARCH_MEMBER_BYID : string = `http://localhost:8080/mem/api/getMemberDetailsById`;

  private SEARCH_MEMBER_BYNAME : string = `http://localhost:8080/mem/api/getMemberByName`;

  private SEARCH_MEMBER_BY_PHYSICIAN : string = `http://localhost:8080/mem/api/getMemberByPhysician`;

  private MEMBER_BYUSER_ID : string = `http://localhost:8080/mem/api/getMemberDetailsByUserId`;

  private MEMBERDETAILS_BYCLAIMID : string = `http://localhost:8080/mem/api/getMemberByClaimId`;

  private GETMEMBER_BYUSERID : string = `http://localhost:8080/mem/api/getMemberByUserId`;

  private UPDATE_MEMBER : string = `http://localhost:8080/mem/api/updateMember`;

  registerMember(member : Member) : Observable<Member>{
    return this.http.post<Member>(this.REGISTER_MEMBER,member);
  }

  searchByMemberId(memberId : number) : Observable<Array<MemberDetails>> {
    return this.http.get<Array<MemberDetails>>(`${this.SEARCH_MEMBER_BYID}/${memberId}`,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

  searchByMemberName(firstName : string, lastName : string) : Observable<Array<MemberDetails>> {
    return this.http.get<Array<MemberDetails>>(`${this.SEARCH_MEMBER_BYNAME}/${firstName}/${lastName}`,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

  searchByPhysician(physician : number) : Observable<Array<MemberDetails>> {
    return this.http.get<Array<MemberDetails>>(`${this.SEARCH_MEMBER_BY_PHYSICIAN}/${physician}`,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

  memberDetailsByClaimId(claimId : number) : Observable<Array<MemberDetails>> {
    return this.http.get<Array<MemberDetails>>(`${this.MEMBERDETAILS_BYCLAIMID}/${claimId}`,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

  getMemberDetails(userid : number) : Observable<Array<MemberDetails>> {
    return this.http.get<Array<MemberDetails>>(`${this.MEMBER_BYUSER_ID}/${userid}`,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

  getMemberByUserId(userId : number) : Observable<Member> {
    return this.http.get<Member>(`${this.GETMEMBER_BYUSERID}/${userId}`,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

  updateMember(member : Member) : Observable<Member>{
    return this.http.put<Member>(this.UPDATE_MEMBER,member,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

}
