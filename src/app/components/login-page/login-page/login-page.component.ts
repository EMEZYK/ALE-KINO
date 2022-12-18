import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  public loginForm: FormGroup;
  user: User[];
  submitted: boolean = false;

  constructor(
    private formBuilder: NonNullableFormBuilder,
    private userService: AuthService,
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
