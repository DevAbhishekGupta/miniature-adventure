import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Claim } from '../model/claim';
import { MemberDetails } from '../model/member-details';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private http : HttpClient) { }

  private ADD_CLAIM : string = `http://localhost:8080/claim/api/addClaim`;

  private MEMBERDETAILS_BYCLAIMID : string = `http://localhost:8080/claim/api/getMemberByClaimId`;

  claimSubmit(claim : Claim) : Observable<Claim>{
    return this.http.post<Claim>(this.ADD_CLAIM,claim,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

  memberDetailsByClaimId(claimId : number) : Observable<Array<MemberDetails>> {
    return this.http.post<Array<MemberDetails>>(`${this.MEMBERDETAILS_BYCLAIMID}/${claimId}`,claimId,{headers : {"Authorization" : `Bearer ${localStorage.getItem('token')}`}});
  }

}
