import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppNavComponent } from './app-nav/app-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppTableComponent } from './app-table/app-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { PatientsComponent } from './patients/patients.component';
import { ProblemsComponent } from './problems/problems.component';
import { VisitsComponent } from './visits/visits.component';
import { LabResultsComponent } from './lab-results/lab-results.component';
import { RxComponent } from './rx/rx.component';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { LoginComponent } from './login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    AppComponent,
    AppNavComponent,
    AppTableComponent,
    PatientsComponent,
    ProblemsComponent,
    VisitsComponent,
    LabResultsComponent,
    RxComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgxAuthFirebaseUIModule.forRoot({
      apiKey: "AIzaSyBpet62ZKXbFmRquSONCvJ_PNJP1FTItGE",
      authDomain: "mkayurvedam.firebaseapp.com",
      databaseURL: "https://mkayurvedam.firebaseio.com",
      projectId: "mkayurvedam",
      storageBucket: "mkayurvedam.appspot.com",
      messagingSenderId: "730498769972",
      appId: "1:730498769972:web:6e926fc583ce6c17"
  }),
  AngularFireModule.initializeApp(
    {
      apiKey: "AIzaSyBpet62ZKXbFmRquSONCvJ_PNJP1FTItGE",
      authDomain: "mkayurvedam.firebaseapp.com",
      databaseURL: "https://mkayurvedam.firebaseio.com",
      projectId: "mkayurvedam",
      storageBucket: "mkayurvedam.appspot.com",
      messagingSenderId: "730498769972",
      appId: "1:730498769972:web:6e926fc583ce6c17"
  },'angularfs'),
  AngularFirestoreModule,
  FlexLayoutModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {




}
