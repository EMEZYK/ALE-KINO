import { Component, inject } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { EmailConfirmationService } from 'src/app/domains/users/guest/email-confirmation.service';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  private emailService = inject(EmailConfirmationService);
  userEmail$: Observable<string>;
  public orderQrCode: string;
  public qrCodeDownloadLink: SafeUrl = '';

  // BASE_QRCODE_URL = `https://barcodeapi.org/api/qr/`;

  constructor() {
    this.userEmail$ = this.emailService.email$;
    this.orderQrCode = 'http://localhost:4200/user/orders/12';
  }

  onChangeUrl(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
}
