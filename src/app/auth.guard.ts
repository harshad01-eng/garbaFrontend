import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(): boolean {
    if(this.authService.isAuthenticated()) return true
     else return false
    // Logic to determine if the route can be activated
 
  }
}
