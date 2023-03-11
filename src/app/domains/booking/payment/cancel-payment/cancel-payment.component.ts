import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cancel-payment',
  templateUrl: './cancel-payment.component.html',
  styleUrls: ['./cancel-payment.component.css'],
  standalone: true,
  imports: [FontAwesomeModule, ButtonComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelPaymentComponent {
  private location = inject(Location);

  cancelIcon = faTimesCircle;

  navigateToPreviousPage(): void {
    this.location.back();
  }
}
