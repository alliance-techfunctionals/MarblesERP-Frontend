import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticated = false;
  private authSecretKey = 'Token';

  constructor() { 
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    localStorage.removeItem(this.authSecretKey);
    this.isAuthenticated = false;
  }

  getRole(): Number{
    const token = localStorage.getItem('Token');
    if(token){
      const decodedToken: any = jwtDecode(token)
      const userRole = decodedToken["UserRole"]
      return userRole;
    }
    return 0;
  }

  getUserId(): Number{
    const token = localStorage.getItem('Token');
    if(token){
      const decodedToken: any = jwtDecode(token)
      const userId = decodedToken["Id"]
      return userId;
    }
    return 0;
  }
}