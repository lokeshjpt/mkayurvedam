import { DataService } from './service/data.service';
import { DeleteDialogComponent } from './patients/dialogs/delete/delete.dialog.component';
import { EditDialogComponent } from './patients/dialogs/edit/edit.dialog.component';
import { AddDialogComponent } from './patients/dialogs/add/add.dialog.component';
import { AuthService } from './service/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AuthGuard } from './service/auth.guard';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { NotifyService } from './service/notify.service';
import {MatTabsModule} from '@angular/material/tabs';

import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material';



import {HttpClientModule} from '@angular/common/http';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatCheckboxModule } from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    AppTableComponent,
    PatientsComponent,
    ProblemsComponent,
    VisitsComponent,
    LabResultsComponent,
    RxComponent,
    LoginComponent,
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTabsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
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
      }, 'angularfs'),
    AngularFirestoreModule,

    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    FlexLayoutModule

  ],
  entryComponents: [
    AddDialogComponent,
    EditDialogComponent,
    DeleteDialogComponent
  ],
  providers: [AuthGuard, AuthService, NotifyService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule {




}
