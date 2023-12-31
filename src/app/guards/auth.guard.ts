import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router
  ) {}

  canActivate(): boolean {
    let user = JSON.parse(localStorage?.getItem('user') ?? '{}');
    if(user !== null && Object.keys(user).length !== 0 && user !== undefined) {
      return true;
    }

    this.router.navigate(['login'], { replaceUrl: true });
    return false;
  }
  
}
