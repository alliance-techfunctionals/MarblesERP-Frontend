import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { createSignInModel, SignInForm } from 'src/app/shared/store/sign-in/sign-in.model';
import { catchError, Observable, Subscription, tap, throwError } from 'rxjs';
import { SignInService } from 'src/app/shared/store/sign-in/sign-in.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent implements OnInit{
  subscriptions: Subscription[] = [];

  // flag to show spinner
  showSpinner: boolean = false;

  signInForm: FormGroup<SignInForm> = this.formBuilder.nonNullable.group({
    mobileNo: ['', [Validators.required, Validators.minLength(10)]],
    password: ['', Validators.required],
  });

  get mobileNo() {
    return this.signInForm.get('mobileNo') as FormControl;
  }

  get password() {
    return this.signInForm.get('password') as FormControl;
  }
  
  constructor(
    private formBuilder: FormBuilder,
    private signInService: SignInService,
    private _router: Router
  ){

  }
  
  ngOnInit(): void {
    
  }

  uppertSignIn(){
    // this.showSpinner = true;
    const user = createSignInModel({
      mobileNumber: this.mobileNo.value,
      password: this.password.value
    });

    if (this.signInForm.valid || this.signInForm.disabled) {

      this.subscriptions.push(
        this.signInService.upsertSignIn(user).pipe(
          tap((jwtToken) => {
            this.signInForm.markAsPristine();
            localStorage.setItem('Token',jwtToken.toString());
            this.navigate();
          })
        ).subscribe()
      );
    }

  }

  navigate(): void{
    this._router.navigate(['/users']);
  }
}
