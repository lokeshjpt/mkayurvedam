import { AppComponent } from './app.component';

import { ProblemsComponent } from './problems/problems.component';
import { PatientsComponent } from './patients/patients.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisitsComponent } from './visits/visits.component';
import { AuthGuard } from './service/auth.guard';

const routes: Routes = [

  /*{
    path:'patients',
    component:PatientsComponent, canActivate: [AuthGuard]
  },
  {
    path:'problems',
    component:ProblemsComponent, canActivate: [AuthGuard]
  },
  */{
    path:'visits',
    component:VisitsComponent, canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
