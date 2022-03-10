import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { MatSort, Sort } from '@angular/material';
import { MatPaginator, PageEvent } from '@angular/material';
import { fromMatSort, sortRows } from '../service/datasource-utils';
import { fromMatPaginator, paginateRows } from '../service/datasource-utils';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { SharedDataService } from '../service/shared-data.service';


class Patient {

  name: string;
  age: string;
  dob: string;
  gender: string;
  emailId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  createdOn: string;
  updatedAt: string;
  fileNumber: string;
  primaryHealthIssue: string;
  secondaryHealthIssue: string;

}
class PatientId extends Patient {
  id: string;
}

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css', 'patients.styles.scss']
})



export class PatientsComponent {



  selected: string = "name";
  patientsCollection: AngularFirestoreCollection<Patient>;
  patients: any;

  patientDoc: AngularFirestoreDocument<Patient>;
  patient: Observable<Patient>;
  patientObj: Patient;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedRows$: Observable<Array<PatientId>>;
  totalRows$: Observable<number>;

  showPatientsTable: boolean = true;

  patientRec: PatientId;

  constructor(private afs: AngularFirestore, private data: SharedDataService, public dialog: MatDialog) {

  }
  ngOnInit() {
    this.loadPatients();

    this.patientRec = new PatientId();
  }

  openDialog(patientObject?: PatientId): void {

    this.patientRec = new PatientId();
    if (patientObject) {
      this.patientRec = patientObject;
    }
    const dialogRef = this.dialog.open(PatientDialog, {
      minWidth: '95%',
      minHeight: '95%',
      disableClose: false,
      hasBackdrop: false,
      data: this.patientRec
    });

    dialogRef.componentInstance.isCancel = false;

    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.isCancel) {
        return;
      }

      console.log(this.patientRec);
      if (patientObject) {
        this.editPatient(this.patientRec);
      } else {
        this.addPatient(this.patientRec);
      }
    });
  }

  loadPatients(): void {

    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

    this.patientsCollection = this.afs.collection('Patient');
    this.patients = this.patientsCollection.snapshotChanges().pipe(
      map(docArray => {
        return docArray.map(doc => {
          const data = doc.payload.doc.data() as Patient;
          //  console.log(data);
          const id = doc.payload.doc.id;
          return { id, ...data };
        })
      }));

    this.totalRows$ = this.patients.pipe(map((rows: Array<PatientId>) => rows.length));
    this.displayedRows$ = this.patients.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }


  addPatient(patient: PatientId): void {

    const patientModel: any = {
      name: patient.name,
      age: patient.age,
      dob: patient.dob,
      gender: patient.gender,
      address: patient.address,
      state: patient.state,
      city: patient.city,
      country: patient.country,
      pincode: patient.pincode,
      emailId: patient.emailId,
      phone: patient.phone,
      createdOn: new Date(),
      updatedAt: new Date(),
      fileNumber: patient.fileNumber,
      primaryHealthIssue: patient.primaryHealthIssue,
      secondaryHealthIssue: patient.secondaryHealthIssue
    };

    this.afs.collection('Patient').add(patientModel);
    this.loadPatients();
  }

  editPatient(patient: PatientId): void {
    const patientModel: any = {
      name: patient.name,
      age: patient.age,
      dob: patient.dob,
      gender: patient.gender,
      address: patient.address,
      state: patient.state,
      city: patient.city,
      country: patient.country,
      pincode: patient.pincode,
      emailId: patient.emailId,
      phone: patient.phone,
      updatedAt: new Date(),
      fileNumber: patient.fileNumber,
      primaryHealthIssue: patient.primaryHealthIssue,
      secondaryHealthIssue: patient.secondaryHealthIssue
    };

    this.afs.doc('Patient/' + patient.id).update(patientModel);
    this.loadPatients();
  }

  getPost(patientId) {
    this.patientDoc = this.afs.doc('Patients/' + patientId);
    this.patient = this.patientDoc.valueChanges();
  }

  deletePatient(patientId: string): void {
    this.afs.doc('Patient/' + patientId).delete();
    this.loadPatients();
  }



  filterPatients(q: string, filterBy: string): void {

    if (q && q != '') {

      const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
      const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

      this.patientsCollection = this.afs.collection('Patient'
        , ref => ref.where(filterBy, '>=', q).where(filterBy, '<=', q + '\uf8ff'));
      this.patients = this.patientsCollection.snapshotChanges().pipe(
        map(docArray => {
          return docArray.map(doc => {
            const data = doc.payload.doc.data() as Patient;
            //  console.log(data);
            const id = doc.payload.doc.id;
            return { id, ...data };
          });
        }));

      this.totalRows$ = this.patients.pipe(map((rows: Array<PatientId>) => rows.length));
      this.displayedRows$ = this.patients.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    } else {
      this.loadPatients();
    }
  }

  select(selectedPatient: PatientId): void {

    this.data.setPatientData(selectedPatient);
    this.data.changeMessage(selectedPatient.name + " | " + selectedPatient.age + " yrs | "
      + selectedPatient.gender + " | " + selectedPatient.city);
  }

}

@Component({
  selector: 'patient-dialog',
  templateUrl: 'patient-dialog.html',
  styleUrls: ['patient-dialog.css'],
})
export class PatientDialog {

  public isCancel: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<PatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PatientId) { }

  onNoClick(): void {
    this.isCancel = true;
    this.dialogRef.close();

  }

}
