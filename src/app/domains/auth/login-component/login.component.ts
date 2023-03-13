import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

import { CustomValidators } from 'src/app/shared/validators';
import { AuthLoginStateService } from '../auth-login.service';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonComponent,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
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
