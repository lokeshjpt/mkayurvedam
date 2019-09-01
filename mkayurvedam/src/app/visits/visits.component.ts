import { AuthService } from './../service/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Observable  } from 'rxjs';
import { of  } from 'rxjs';
import { MatSort, Sort } from '@angular/material';
import { MatPaginator, PageEvent } from '@angular/material';
import { fromMatSort, sortRows } from '../service/datasource-utils';
import { fromMatPaginator, paginateRows } from '../service/datasource-utils';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { SharedDataService } from '../service/shared-data.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';


class Visit {

  notes: string;
  recoveryNotes: string;
  visitDate: string;
  labsOrdered:string;
  labResults: string;
  rxOrder: string;
  nextVisitDate:string;
  patientRef:string;
  problemsRef:string[];
  createdOn:string;
  updatedAt:string;
}
class VisitId extends Visit {
  id: string;
}

@Component({
  selector: 'app-vistis',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css', 'visits.styles.scss']
})



export class VisitsComponent implements OnInit{



  selected: string = "visitDate";
  visitsCollection: AngularFirestoreCollection<Visit>;
  visits: any;

  visitDoc: AngularFirestoreDocument<Visit>;
  visit: Observable<Visit>;
  visitObj: Visit;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedRows$: Observable<Array<VisitId>>;
  totalRows$: Observable<number>;


  visitRec: VisitId;

  constructor(private afs: AngularFirestore, private data: SharedDataService
    , public dialog: MatDialog, public router: Router
    , private _snackBar: MatSnackBar, private auth: AuthService) {

  }


  ngOnInit() {

    this.loadVisits();

   this.visitRec = new VisitId();
  }

  openDialog(visitObject? : VisitId ): void {

    this.visitRec = new VisitId();
    if(visitObject){
      this.visitRec = visitObject;
    }else{

      if (this.data.problems == null || this.data.problems.length == 0) {
        this._snackBar.open("Please select problems first", "Go", {
          duration: 3000,
        });
        this.router.navigate(['/problems']);
        return;
      }
    }
    const dialogRef = this.dialog.open(VisitDialog, {
      minWidth: '95%',
      minHeight: '95%',
      data: this.visitRec
    });

    dialogRef.componentInstance.isCancel = false;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.isCancel){
        return;
      }

      console.log(this.visitRec);
      if(visitObject){

        this.editVisit(this.visitRec);
      }
      else{
        this.addVisit(this.visitRec);
     }
    });
  }

   loadVisits(): void {

    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);


    let patientId:any = null;
    let patientEmail = null;
    this.auth.user.subscribe((user:any) => {
      patientEmail = user.email;
      console.log(" patient email = "+ patientEmail);
    });

    this.afs.collection('Patient').ref.where('emailId', '==', patientEmail)
            .get().then((patient) => {
                patient.docs.forEach(doc => {
                  patientId = doc.id;
                  console.log(" patient id = "+ patientId);

                  this.visitsCollection = this.afs.collection('Visit', ref => ref.where('patientRef', '==', patientId));
                  this.visits = this.visitsCollection.snapshotChanges().pipe(
                    map(docArray => {
                      return docArray.map(doc => {
                        const data = doc.payload.doc.data() as Visit;
                      //  console.log(data);
                        const id = doc.payload.doc.id;

                        const probs: Array<any> = new Array<any>();

                        data.problemsRef.forEach((problem) => {
                            this.afs.collection('Problem').doc(problem).get().subscribe(doc => {
                              probs.push(doc.data());
                            });

                        });
                        data.problemsRef = probs;

                        return { id, ...data };
                      });
                    }));

                    this.totalRows$ = this.visits.pipe(map((rows:Array<VisitId>) => rows.length));
                    this.displayedRows$ = this.visits.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));

                });
    });





  }


  addVisit(visit: VisitId): void {

    let problemIds : Array<any> = new Array<any>();

    this.data.problems.forEach(problem => {
      problemIds.push(problem.id);
    });

    const visitModel: any = {

      notes: visit.notes,
      recoveryNotes: visit.recoveryNotes,
      visitDate: visit.visitDate,
      labsOrdered: visit.labsOrdered,
      labResults: visit.labResults,
      rxOrder: visit.rxOrder,
      nextVisitDate: visit.nextVisitDate,
      patientRef: this.data.patient.id,
      problemsRef:problemIds,
      createdOn:new Date(),
      updatedAt:new Date(),

    };

    this.afs.collection('Visit').add(visitModel);
    this.loadVisits();
  }

  editVisit(visit: VisitId): void{

    const visitModel: any = {

      notes: visit.notes,
      recoveryNotes: visit.recoveryNotes,
      visitDate: visit.visitDate,
      labsOrdered: visit.labsOrdered,
      labResults: visit.labResults,
      rxOrder: visit.rxOrder,
      nextVisitDate: visit.nextVisitDate,
      updatedAt:new Date(),

    };

    this.afs.doc('Visit/' + visit.id).update(visitModel);
    this.loadVisits();
  }



  deleteVisit(visitId: string): void {
    this.afs.doc('Visit/' + visitId).delete();
    this.loadVisits();
  }



  filterVisits(q: string, filterBy: string): void{

    if(q && q != ''){

    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

    this.visitsCollection = this.afs.collection('Visit'
    , ref => ref.where(filterBy, '>=', q ).where(filterBy, '<=', q + '\uf8ff'));
    this.visits = this.visitsCollection.snapshotChanges().pipe(
      map(docArray => {
        return docArray.map(doc => {
          const data = doc.payload.doc.data() as Visit;
        //  console.log(data);
          const id = doc.payload.doc.id;

          const probs: Array<any> = new Array<any>();

          data.problemsRef.forEach((problem) => {
              this.afs.collection('Problem').doc(problem).get().subscribe(doc => {
                probs.push(doc.data());
              });

          });
          data.problemsRef = probs;
          return { id, ...data };
        })
      }));

    this.totalRows$ = this.visits.pipe(map((rows: Array<VisitId>) => rows.length));
    this.displayedRows$ = this.visits.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    }else{
      this.loadVisits();
    }
  }


}

@Component({
  selector: 'visit-dialog',
  templateUrl: 'visit-dialog.html',
  styleUrls: ['visit-dialog.css'],
})
export class VisitDialog {

  public isCancel: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<VisitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: VisitId) {}

  onNoClick(): void {
    this.isCancel = true;
    this.dialogRef.close();

  }

}
