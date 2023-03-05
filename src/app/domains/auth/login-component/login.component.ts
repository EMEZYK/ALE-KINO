import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { CustomValidators } from 'src/app/shared/validators';
import { AuthLoginStateService } from '../auth-login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthLoginStateService);

  loginForm: FormGroup;
  fieldTextType: boolean;
  eyeIcon = faEye;

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      // email: ['', [Validators.required, Validators.email]],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.authService
      .login(
        this.loginForm.get('email')?.value,
        this.loginForm.get('password')?.value
      )
      .subscribe();
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
