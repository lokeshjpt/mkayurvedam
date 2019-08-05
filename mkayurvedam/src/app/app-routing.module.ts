import { LabResultsComponent } from './lab-results/lab-results.component';
import { RxComponent } from './rx/rx.component';
import { ProblemsComponent } from './problems/problems.component';
import { PatientsComponent } from './patients/patients.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppNavComponent } from './app-nav/app-nav.component';
import { VisitsComponent } from './visits/visits.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [

  {
    path:'login',
    component:LoginComponent
  },

  {
    path:'patients',
    component:PatientsComponent
  },
  {
    path:'problems',
    component:ProblemsComponent
  },
  {
    path:'visits',
    component:VisitsComponent
  },
  {
    path:'rx',
    component:RxComponent
  },
  {
    path:'lab-results',
    component:LabResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
