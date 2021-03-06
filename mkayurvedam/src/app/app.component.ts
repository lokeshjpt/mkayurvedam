import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from './service/auth.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from './service/shared-data.service';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


  title = 'Radha Krishna Ayurvedam';
  selectedPatient: string = "";

  isValid = false;

  navLinks = [
    {
      path: 'patients',
      label: 'Patients'
    },
    {
      path: 'problems',
      label: 'Problems'
    },
    {
      path: 'visits',
      label: 'Visits'
    },
    {
      path: 'calendar',
      label: 'Calendar'
    }

  ];


  constructor(private auth: AuthService, private router: Router, private data: SharedDataService
                                    , private dialog: MatDialog){

    if (auth.authenticated) {
      this.isValid = true;
    }

  }

  ngOnInit() {

    if (window.localStorage.getItem('patient')) {
        this.data.patient = JSON.parse(window.localStorage.getItem('patient'));
        this.data.changeMessage(this.data.patient.name + " | "+ this.data.patient.age + " yrs | "
    + this.data.patient.gender + " | "+ this.data.patient.city);
    }
    if (window.localStorage.getItem('problems')) {
      this.data.problems = JSON.parse(window.localStorage.getItem('problems'));
    }
    this.data.currentMessage.subscribe(selectedPatient => this.selectedPatient = selectedPatient);

  }

  logout(){
    console.log('signout');
    this.auth.signOut();
    this.router.navigate(['/home']);
    location.reload();
  }

  printUser(event) {
    sessionStorage.setItem('userLoggedIn', 'true');
    location.reload();
  }

  printError(event) {
    console.error(event);
   }


  showPatientAndProblemsSelected(): void {
    this.dialog.open(PatientsProblemsDialog, {
      minWidth: '95%',
      minHeight: '95%',
      disableClose: false,
      hasBackdrop: false,
      data: {"patient": this.data.patient, "problems": this.data.problems}
    });
  }

}


@Component({
  selector: 'patient-problems-dialog',
  templateUrl: 'patient-problems-bottom-sheet.html',
  styleUrls: ['app.component.css'],
})
export class PatientsProblemsDialog {

  constructor(
    public dialogRef: MatDialogRef<PatientsProblemsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private dataSvc: SharedDataService) {}

  close(): void {

    this.dialogRef.close();

  }

  removeProblemSelected(problem: any): void{

    this.dataSvc.problems = this.dataSvc.problems.filter(item => item.id !== problem.id);
    this.data.problems = this.data.problems.filter((item: any) => item.id !== problem.id);
  }

}
