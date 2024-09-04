import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  isAuthenticated(): boolean {
    // Check if the user is authenticated, for example, by checking a token in localStorage
    if (typeof localStorage !== 'undefined') {
      if( localStorage.getItem("userRole") !== undefined && localStorage.getItem("userRole") !== null ){
      const token = localStorage.getItem("userRole");
      if (token === "admin") {
        return true;  
      }
    } 
  }
    return false;

  }
}
