import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { map, timeout, tap, finalize } from 'rxjs/operators';
import { Component, Output, EventEmitter, Inject, ViewEncapsulation } from '@angular/core';
import { ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { MatSort, Sort } from '@angular/material';
import { MatPaginator, PageEvent } from '@angular/material';
import { fromMatSort, sortRows } from '../service/datasource-utils';
import { fromMatPaginator, paginateRows } from '../service/datasource-utils';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { SharedDataService } from '../service/shared-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

class Visit {

  notes: string;
  recoveryNotes: string;
  visitDate: string;
  labsOrdered: string;
  labResults: string;
  rxOrder: string;
  nextVisitDate: string;
  patientRef: string;
  problemsRef: string[];
  createdOn: string;
  updatedAt: string;
  visitRxSlipLink: string;
  visitFiles: any;
}
class VisitId extends Visit {
  id: string;
}

class VisitRecordFile{
  downloadURL: string;
  fileName: string;
}

@Component({
  selector: 'app-vistis',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css', 'visits.styles.scss'],
  encapsulation: ViewEncapsulation.None,
})



export class VisitsComponent implements OnInit {



  selected = 'visitDate';
  visitsCollection: AngularFirestoreCollection<Visit>;
  visits: any;

  visitDoc: AngularFirestoreDocument<Visit>;
  visit: Observable<Visit>;
  visitObj: Visit;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  displayedRows$: Observable<Array<VisitId>>;
  totalRows$: Observable<number>;


  visitRec: VisitId;
  indexExpanded = -1;
  // tslint:disable-next-line: ban-types

  showProgress: boolean;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;

  constructor(private afs: AngularFirestore, private data: SharedDataService
    , public dialog: MatDialog, public router: Router
    , private _snackBar: MatSnackBar
    , private afStorage: AngularFireStorage
  ) {

  }



  ngOnInit() {

    this.showProgress = false;

    if (this.data.patient == null) {
      this._snackBar.open('Please select patient first', 'Go', {
        duration: 3000,
      });
      this.router.navigate(['/patients']);
      return;
    }



    this.loadVisits();

    this.visitRec = new VisitId();

  }

  togglePanels(index: number) {
    this.indexExpanded = index === this.indexExpanded ? -1 : index;
  }

  openDialog(visitObject?: VisitId): void {

    this.visitRec = new VisitId();
    if (visitObject) {
      this.visitRec = visitObject;
    } else {

      if (this.data.problems == null || this.data.problems.length === 0) {
        this._snackBar.open('Please select problems first', 'Go', {
          duration: 3000,
        });
        this.router.navigate(['/problems']);
        return;
      }
    }
    const dialogRef = this.dialog.open(VisitDialog, {
      minWidth: '95%',
      minHeight: '95%',
      disableClose: false,
      hasBackdrop: false,
      data: this.visitRec
    });

    dialogRef.componentInstance.isCancel = false;

    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.isCancel) {
        return;
      }

      console.log(this.visitRec);
      if (visitObject) {

        this.editVisit(this.visitRec);
      } else {
        this.addVisit(this.visitRec);
      }
    });
  }

 loadVisits(): void {

    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

    this.visitsCollection = this.afs.collection('Visit', ref => ref.where('patientRef', '==', this.data.patient.id));
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

          data.visitFiles = this.afs.collection('files', ref => ref.where('visitId', '==', id)).snapshotChanges().pipe(
            map(docArray => {
              return docArray.map(doc => {
                const id = doc.payload.doc.id;
                const data = doc.payload.doc.data() as VisitRecordFile;
                return {id, ...data};
              });
            }));
          return { id, ...data };
        });
      }));

    this.totalRows$ = this.visits.pipe(map((rows: Array<VisitId>) => rows.length));
    this.displayedRows$ = this.visits.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }


  addVisit(visit: VisitId): void {

    const problemIds: Array<any> = new Array<any>();

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
      problemsRef: problemIds,
      createdOn: new Date(),
      updatedAt: new Date(),

    };

    this.afs.collection('Visit').add(visitModel);
    this.loadVisits();
  }

  editVisit(visit: VisitId): void {

    const visitModel: any = {

      notes: visit.notes,
      recoveryNotes: visit.recoveryNotes,
      visitDate: visit.visitDate,
      labsOrdered: visit.labsOrdered,
      labResults: visit.labResults,
      rxOrder: visit.rxOrder,
      nextVisitDate: visit.nextVisitDate,
      updatedAt: new Date(),

    };

    this.afs.doc('Visit/' + visit.id).update(visitModel);
    this.loadVisits();
  }



  deleteVisit(visitId: string): void {
    this.afs.doc('Visit/' + visitId).delete();
    this.loadVisits();
  }

  deleteVisitRecordFile(fileId: string, path: string): void {
    this.afStorage.ref(path).delete();
    this.afs.doc('files/' + fileId).delete();
    //this.loadVisits();
  }



  filterVisits(q: string, filterBy: string): void {

    if (q && q !== '') {

      const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
      const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

      this.visitsCollection = this.afs.collection('Visit'
        , ref => ref.where(filterBy, '>=', q).where(filterBy, '<=', q + '\uf8ff'));
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

      this.totalRows$ = this.visits.pipe(map((rows: Array<VisitId>) => rows.length));
      this.displayedRows$ = this.visits.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    } else {
      this.loadVisits();
    }
  }

  upload(event, visitId: VisitId, i) {
    // this.showProgress = true;
    const file: File = event.target.files[0];
    console.log('file name :', file.name);
    console.log('VisitId.id :', visitId.id);
    // this.afStorage.upload('prescriptions/'+file.name, event.target.files[0]);

    const ref = this.afStorage.ref(visitId.id);
    const task: AngularFireUploadTask = ref.put(event.target.files[0]);
    task.then((result) => {


      // Get URL and store to pass
      ref.getDownloadURL().subscribe((url) => {
        console.log('url ', url);
        visitId.visitRxSlipLink = url;
        const visitModel: any = {

          notes: visitId.notes,
          recoveryNotes: visitId.recoveryNotes,
          visitDate: visitId.visitDate,
          labsOrdered: visitId.labsOrdered,
          labResults: visitId.labResults,
          rxOrder: visitId.rxOrder,
          nextVisitDate: visitId.nextVisitDate,
          updatedAt: new Date(),
          visitRxSlipLink: visitId.visitRxSlipLink

        };
        console.log('visitModel ', visitModel);

        try {

          this.afs.doc('Visit/' + visitId.id).update(visitModel);

        } catch {
          console.error('error while updating visit record');
        }

      });
    });
    this.uploadProgress = task.percentageChanges();
    this.uploadProgress.subscribe((p: any) => {
      console.log('progress = ', p);
      if (p === 100) {

      }
    });


    return;

  }

  generatePdf(visit: Visit) {

    /*notes: string;
  recoveryNotes: string;
  visitDate: string;
  labsOrdered:string;
  labResults: string;
  rxOrder: string;
  nextVisitDate:string;
  */
    const documentDefinition = {
      content:
        [
          {
            // tslint:disable-next-line: max-line-length
            text: '--------------------------------------------------------------------------------------------------------',
            bold: true
          },
          {
            text: 'Dr. Murali Krishna Ayurvedic Clinic | Patient Visit Summary',
            bold: true
          },
          {
            // tslint:disable-next-line: max-line-length
            text: '--------------------------------------------------------------------------------------------------------',
            bold: true
          },
          {
            text: ' '
          },
          {
            text: 'Visit Date',
            bold: true
          },
          {
            text: visit.visitDate

          },
          {
            text: ' '
          },
          {
            text: 'Patient Details',
            bold: true
          },
          {
            // tslint:disable-next-line: max-line-length
            text: this.data.patient.name + ' | ' + this.data.patient.age + ' Yrs ' + ' | DOB: ' + this.data.patient.dob + ' | ' + this.data.patient.city

          },
          {
            text: ' '
          },
          {
            text: 'Visit Notes',
            bold: true
          },
          {
            text: visit.notes

          },
          {
            text: ' '
          },

          {
            text: 'Rx Order',
            bold: true
          },
          {
            text: visit.rxOrder

          },
          {
            text: ' '
          },
          {
            text: 'Labs Ordered',
            bold: true
          },
          {
            text: visit.labsOrdered

          },
          {
            text: ' '
          },
          {
            text: 'Labs Results',
            bold: true
          },
          {
            text: visit.labResults

          },
          {
            text: ' '
          },
          {
            text: 'Recovery Notes',
            bold: true
          },
          {
            text: visit.recoveryNotes

          },
          {
            text: ' '
          },
          {
            text: 'Next Vist Date',
            bold: true
          },
          {
            text: visit.nextVisitDate

          },
          {
            text: ' '
          }
        ]
    };


    pdfMake.createPdf(documentDefinition).download();

  }

}

@Component({
  selector: 'visit-dialog',
  templateUrl: 'visit-dialog.html',
  styleUrls: ['visit-dialog.css'],
})
export class VisitDialog {

  public isCancel = false;
  constructor(
    public dialogRef: MatDialogRef<VisitDialog>,
    @Inject(MAT_DIALOG_DATA) public data: VisitId) { }

  onNoClick(): void {
    this.isCancel = true;
    this.dialogRef.close();

  }

}
