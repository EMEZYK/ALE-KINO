import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  faFacebookSquare,
  faInstagramSquare,
  faYoutubeSquare,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  imports: [FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  facebookIcon = faFacebookSquare;
  igIcon = faInstagramSquare;
  youtubeIcon = faYoutubeSquare;
}
