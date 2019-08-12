import { AuthService } from './service/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Radha Krishna Ayurvedam';


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


  constructor(private auth: AuthService, private router: Router){

    if (auth.authenticated) {
      this.isValid = true;
    }

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
