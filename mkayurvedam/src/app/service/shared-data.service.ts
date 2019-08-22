import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  patient: any = null;
  problems: Array<any> = new Array<any>();

  constructor() {
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  setPatientData(patient: any){
    this.patient = patient;
    console.log(patient);
    this.problems = new Array<any>();
  }

  setProblemData(problem: any){

    this.problems.push(problem);
    console.log(this.problems);
  }

}
