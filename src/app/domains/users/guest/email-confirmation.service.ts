import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailConfirmationService {
  public userEmail: string;

  set email(confirmedEmail: string) {
    this.userEmail = confirmedEmail
  }

  get email() {
    return this.userEmail
  }
}
