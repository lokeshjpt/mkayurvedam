import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mkayurvedam';

  constructor(private router: Router){}

  printUser(event) {
    console.log(event);
    console.log("test");
    this.router.navigate(['/home']);
  }

  printError(event) {
   console.error(event);
  }

}
