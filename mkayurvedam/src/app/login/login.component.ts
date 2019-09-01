import { AuthService } from './../service/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {



  ngOnInit() {

  }

  constructor(private router: Router
            ){}

  printUser(event) {


    this.router.navigate(['/visits']);

    sessionStorage.setItem('userLoggedIn', 'true');
  }

  printError(event) {
   console.error(event);
  }


}
