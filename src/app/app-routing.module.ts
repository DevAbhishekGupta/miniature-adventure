import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { MemberdashboardComponent } from './memberdashboard/memberdashboard.component';
import { RegisteruserComponent } from './registeruser/registeruser.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisteruserComponent},
  {path: '', component: AdmindashboardComponent, canActivate : [AuthGuard]},
  {path: 'admin', component: AdmindashboardComponent, canActivate : [AuthGuard]},
  {path: 'member', component: MemberdashboardComponent, canActivate : [AuthGuard]},
  {path: 'member/:memberId', component: MemberdashboardComponent, canActivate : [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
