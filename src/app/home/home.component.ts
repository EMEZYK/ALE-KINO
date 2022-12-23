import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-wrapper">
      <app-movie-list></app-movie-list>
    </div>
  `,
  styles: [
    `
      .home-wrapper {
        width: 100vw;
        height: auto;
        margin: 0 auto;
        align-items: center;
        justify-content: center;
        background-color: #172032;
      }
    `,
  ],
})
export class HomeComponent {}
