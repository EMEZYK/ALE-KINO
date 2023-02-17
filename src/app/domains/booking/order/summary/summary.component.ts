import { Component, inject } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Observable, tap } from 'rxjs';
import { EmailConfirmationService } from 'src/app/domains/users/guest/email-confirmation.service';
import { OrderStateService } from '../order.service';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  private emailService = inject(EmailConfirmationService);
  private orderService = inject(OrderStateService);
  userEmail$: Observable<string>;
  public orderQrCode: string;
  public qrCodeDownloadLink: SafeUrl = '';
  orderId: number;

  constructor() {
    this.userEmail$ = this.emailService.email$;
    this.orderService.order$
      .pipe(
        tap((order) => {
          this.orderId = order.id;
        })
      )
      .subscribe();
    this.orderQrCode = `http://localhost:4200/user/orders/${this.orderId}`;
  }

  onChangeUrl(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
}
