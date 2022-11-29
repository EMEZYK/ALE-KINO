import { Component, OnInit } from '@angular/core';
import { faFacebook, faInstagramSquare, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  facebookIcon = faFacebook;
  igIcon = faInstagramSquare
  youtubeIcon = faYoutubeSquare;


  constructor() { }

  ngOnInit(): void {
  }

}
