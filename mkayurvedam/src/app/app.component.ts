import { AuthService } from './service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from './service/shared-data.service';

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
    }

  ];


  constructor(private auth: AuthService, private router: Router, private data: SharedDataService){

    if (auth.authenticated) {
      this.isValid = true;
    }

  }

  ngOnInit() {
    this.data.currentMessage.subscribe(selectedPatient => this.selectedPatient = selectedPatient)
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

}
