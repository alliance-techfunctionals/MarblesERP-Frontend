import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

// const router = new Router();

export const authGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const token = localStorage.getItem('Token');
  if(token){
    const decodedToken: any = jwtDecode(token)
    const userRole = decodedToken["UserRole"]

    const expectedRole = route.data['expectedRole'];
    if (userRole && expectedRole.includes(userRole)){
      return true;
    }
    else{
      if(userRole == 2000){
        router.navigate(['/sale']);
      }
      else if(userRole == 3000 || userRole == 6000 || userRole == 7000){
        router.navigate(['/inventory']);
      }
      else if(userRole == 8000){
        router.navigate(['/voucher']);
      }
      return false;
    }

  }
  else{
    router.navigate(['auth/signin']);
    return true;
  }
};
