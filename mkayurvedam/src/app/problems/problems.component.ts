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


class Problem {

  title: string;
  description: string;
  symptoms: string;
  status:string;
  diagnosisHistory: string;
  treatmentHistory: string;
  surgicalHistory:string;
  medicinesUsed:string;
  usingAyurvedam:string;
  createdOn:string;
  updatedAt:string;
  patientRef:string;

}
class ProblemId extends Problem {
  id: string;
}

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css', 'problems.styles.scss']
})



export class ProblemsComponent implements OnInit {



  selected: string = "title";
  problemsCollection: AngularFirestoreCollection<Problem>;
  problems: any;

  problemDoc: AngularFirestoreDocument<Problem>;
  problem: Observable<Problem>;
  problemObj: Problem;

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedRows$: Observable<Array<ProblemId>>;
  totalRows$: Observable<number>;


  problemRec: ProblemId;

  constructor(private afs: AngularFirestore, private data: SharedDataService
    , public dialog: MatDialog, public router: Router
    ,private _snackBar: MatSnackBar) {

  }
  ngOnInit() {


   if(this.data.patient == null)
   {
    this._snackBar.open("Please select patient first", "Go",{
      duration: 3000,
    });
     this.router.navigate(['/patients']);
     return;
   }
   this.loadProblems();

   this.problemRec = new ProblemId();
  }

  openDialog(problemObject? : ProblemId ): void {

    this.problemRec = new ProblemId();
    if(problemObject){
      this.problemRec = problemObject;
    }
    const dialogRef = this.dialog.open(ProblemDialog, {
      minWidth: '95%',
      minHeight: '95%',
      data: this.problemRec
    });

    dialogRef.componentInstance.isCancel = false;

    dialogRef.afterClosed().subscribe(result => {
      if(dialogRef.componentInstance.isCancel){
        return;
      }

      console.log(this.problemRec);
      if(problemObject){

        this.editProblem(this.problemRec);
      }
      else{
        this.addProblem(this.problemRec);
     }
    });
  }

  loadProblems(): void {

    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);

    this.problemsCollection = this.afs.collection('Problem', ref => ref.where('patientRef', '==', this.data.patient.id));
    this.problems = this.problemsCollection.snapshotChanges().pipe(
      map(docArray => {
        return docArray.map(doc => {
          const data = doc.payload.doc.data() as Problem;
        //  console.log(data);
          const id = doc.payload.doc.id;
          return { id, ...data };
        })
      }));

    this.totalRows$ = this.problems.pipe(map((rows:Array<ProblemId>) => rows.length));
    this.displayedRows$ = this.problems.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
  }


  addProblem(problem: ProblemId): void {

    const problemModel: any = {
      title: problem.title,
      description: problem.description,
      symptoms: problem.symptoms,
      status:problem.status,
      diagnosisHistory: problem.diagnosisHistory,
      treatmentHistory: problem.treatmentHistory,
      surgicalHistory:problem.surgicalHistory,
      medicinesUsed:problem.medicinesUsed,
      usingAyurvedam:problem.usingAyurvedam,
      createdOn:new Date(),
      updatedAt:new Date(),
      patientRef: this.data.patient.id
    };

    this.afs.collection('Problem').add(problemModel);
    this.loadProblems();
  }

  editProblem(problem: ProblemId): void{

    const problemModel: any = {
      title: problem.title,
      description: problem.description,
      symptoms: problem.symptoms,
      status:problem.status,
      diagnosisHistory: problem.diagnosisHistory,
      treatmentHistory: problem.treatmentHistory,
      surgicalHistory:problem.surgicalHistory,
      medicinesUsed:problem.medicinesUsed,
      usingAyurvedam:problem.usingAyurvedam,
      updatedAt: new Date()
    };

    this.afs.doc('Problem/' + problem.id).update(problemModel);
    this.loadProblems();
  }



  deleteProblem(problemId: string): void {
    this.afs.doc('Problem/' + problemId).delete();
    this.loadProblems();
  }



  filterProblems(q: string, filterBy: string): void{

    if(q && q != ''){

    const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
    const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
    this.problemsCollection = this.afs.collection('Problem'
    , ref => ref.where(filterBy, '>=', q ).where(filterBy, '<=', q + '\uf8ff'));
    this.problems = this.problemsCollection.snapshotChanges().pipe(
      map(docArray => {
        return docArray.map(doc => {
          const data = doc.payload.doc.data() as Problem;
        //  console.log(data);
          const id = doc.payload.doc.id;
          return { id, ...data };
        })
      }));

    this.totalRows$ = this.problems.pipe(map((rows: Array<ProblemId>) => rows.length));
    this.displayedRows$ = this.problems.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));
    }else{
      this.loadProblems();
    }
  }

  select(selectedProblem: ProblemId): void{

    this.data.setProblemData(selectedProblem);

  }

}

@Component({
  selector: 'problem-dialog',
  templateUrl: 'problem-dialog.html',
  styleUrls: ['problem-dialog.css'],
})
export class ProblemDialog {

  public isCancel: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ProblemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ProblemId) {}

  onNoClick(): void {
    this.isCancel = true;
    this.dialogRef.close();

  }

}
