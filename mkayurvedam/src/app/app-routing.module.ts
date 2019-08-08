import { LabResultsComponent } from './lab-results/lab-results.component';
import { RxComponent } from './rx/rx.component';
import { ProblemsComponent } from './problems/problems.component';
import { PatientsComponent } from './patients/patients.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppNavComponent } from './app-nav/app-nav.component';
import { VisitsComponent } from './visits/visits.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [

  {
    path:'',
    component:VisitsComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'patients',
    component:PatientsComponent, canActivate: [AuthGuard]
  },
  {
    path:'problems',
    component:ProblemsComponent, canActivate: [AuthGuard]
  },
  {
    path:'visits',
    component:VisitsComponent, canActivate: [AuthGuard]
  },
  {
    path:'rx',
    component:RxComponent, canActivate: [AuthGuard]
  },
  {
    path:'lab-results',
    component:LabResultsComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
