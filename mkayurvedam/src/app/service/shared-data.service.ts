import { Patient } from './../model/patient';
import { BehaviorSubject } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService{

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  patient: any = null;
  problems: Array<any> = new Array<any>();

  constructor() {
  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  setPatientData(patient: any) {
    this.patient = patient;
    console.log('patient', patient);
    this.problems = new Array<any>();
    window.localStorage.setItem('patient', JSON.stringify(patient));
  }

  setProblemData(problem: any) {

    if (this.problems.indexOf(problem) === -1) {
      this.problems.push(problem);
    }
    console.log(this.problems);
    window.localStorage.setItem('problems', JSON.stringify(this.problems));
  }
}


