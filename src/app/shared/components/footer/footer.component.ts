import { Component, OnInit } from '@angular/core';
import {
  faFacebookSquare,
  faInstagramSquare,
  faYoutubeSquare,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  facebookIcon = faFacebookSquare;
  igIcon = faInstagramSquare;
  youtubeIcon = faYoutubeSquare;

  // constructor() { }

  ngOnInit(): void {
    console.log('init');
  }
}
