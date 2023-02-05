import { Component, inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-cancel-payment',
  templateUrl: './cancel-payment.component.html',
  styleUrls: ['./cancel-payment.component.css'],
})
export class CancelPaymentComponent {
  private location = inject(Location);

  cancelIcon = faTimesCircle;

  navigateToPreviousPage(): void {
    this.location.back();
  }
}
