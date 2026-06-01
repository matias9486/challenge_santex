import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  formUtil = FormUtils;

  authService = inject(AuthService);
  router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)]]
  });

  onSubmit() {
    if( this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.hasError.set(true);      
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email = "", password ="" } = this.loginForm.value;
    
    this.authService
      .login(email!, password!)
      .subscribe( isAuthenticated => {        
        if(isAuthenticated) {
          this.router.navigateByUrl('/');
          return;
        }

        this.hasError.set(true);      
        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
      }
    );        
  }

}
