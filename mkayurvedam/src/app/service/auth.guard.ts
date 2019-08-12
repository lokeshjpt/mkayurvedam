import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';



@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {


    console.log('this.auth.authenticated', this.auth.authenticated);

    if (this.auth.authenticated) {


      return true;

    }

    console.log('access denied!');
    //this.router.navigate(['/home']);
    return false;

  }
}
