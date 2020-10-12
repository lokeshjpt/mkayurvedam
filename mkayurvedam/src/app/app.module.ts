
import { AuthService } from './service/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, PatientsProblemsDialog } from './app.component';
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
import { PatientsComponent, PatientDialog } from './patients/patients.component';
import { ProblemsComponent, ProblemDialog } from './problems/problems.component';
import { VisitsComponent, VisitDialog } from './visits/visits.component';

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
import { MatExpansionModule, MatDatepickerModule, MatNativeDateModule, MatProgressBar, MatProgressBarModule } from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { SharedDataService } from './service/shared-data.service';
import { DropzoneDirective } from './dropzone.directive';
import { UploaderComponent } from './uploader/uploader.component';
import { UploadTaskComponent } from './upload-task/upload-task.component';
import { MkcalendarComponent } from './mkcalendar/mkcalendar.component';


@NgModule({
  declarations: [
    AppComponent,
    AppTableComponent,
    PatientsComponent,
    ProblemsComponent,
    VisitsComponent,
    PatientsProblemsDialog,
    LoginComponent,
    PatientDialog,
    ProblemsComponent,
    ProblemDialog,
    VisitsComponent,
    VisitDialog,
    DropzoneDirective,
    UploaderComponent,
    UploadTaskComponent,
    MkcalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatExpansionModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    HttpClientModule,
    MatListModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
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
    AngularFirestoreModule.enablePersistence(),

    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    FlexLayoutModule

  ],
  entryComponents: [
    PatientsComponent,
    PatientDialog,
    ProblemsComponent,
    ProblemDialog,
    VisitsComponent,
    VisitDialog,
    PatientsProblemsDialog
  ],

  providers: [AuthGuard, AuthService, NotifyService, SharedDataService],

  bootstrap: [AppComponent]
})
export class AppModule {




}
