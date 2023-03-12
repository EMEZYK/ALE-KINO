import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { UserStateService } from 'src/app/core/user.state.service';
import { EmailConfirmationService } from 'src/app/domains/users/guest/email-confirmation.service';
import { User } from 'src/app/domains/users/user.interface';
import { OrderStateService } from '../order.state.service';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgIf } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { RouterModule } from '@angular/router';
import { Order } from '../order.interface';

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  standalone: true,
  imports: [MatIconModule, AsyncPipe, NgIf, QRCodeModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent implements OnInit {
  private emailService = inject(EmailConfirmationService);
  private orderService = inject(OrderStateService);
  private userService = inject(UserStateService);

  userEmail$: Observable<string>;
  user$: Observable<User> = this.userService.user$;
  order$: Observable<Order> = this.orderService.order$;

  public orderQrCode: string;
  public qrCodeDownloadLink: SafeUrl = '';
  orderId: number;

  ngOnInit() {
    this.userEmail$ = this.emailService.email$;

    this.orderQrCode = `http://localhost:4200/user/orders/${this.orderId}`;
  }

  onChangeUrl(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }
}
