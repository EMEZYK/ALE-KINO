import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthStateService } from '../auth.service';
import { Router } from '@angular/router';
import { User } from '../../users/user.interface';


@Component({
  selector: 'app-login-page',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  user: User[];
  submitted = false;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private userService: AuthStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.submitted = true;
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }
    this.userService.getUsers().subscribe((users: User[]) => {
      const user = users.find(
        (user) =>
          user.emailAddress === this.loginForm.value.email &&
          user.password === this.loginForm.value.password
      );

      if (user && user.role === 'admin') {
        this.userService.setUser(user);
        this.router.navigate(['/', 'admin']);
      } else if (user && user.role === 'user') {
        this.userService.setUser(user);
        this.router.navigate(['user/home']);
      } else {
        return;
      }
    });
  }
}
