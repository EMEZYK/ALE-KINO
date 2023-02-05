import { Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { EmailConfirmationService } from 'src/app/domains/users/guest/email-confirmation.service';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent {
  public orderQrCode: string;
  public qrCodeDownloadLink: SafeUrl = '';
  userEmail$: Observable<string>;

  constructor(private emailService: EmailConfirmationService) {
    this.orderQrCode = 'twojebilety.com';
    this.userEmail$ = this.emailService.email$;
  }

  onChangeUrl(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
}
