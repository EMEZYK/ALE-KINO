import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-wrapper">
      <app-movie-list [selectedDate]="selectedDate"></app-movie-list>
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
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  selectedDate: string;

  ngOnInit() {
    this.selectedDate = this.route.snapshot.paramMap.get('date');
    console.log(this.selectedDate);
  }
}
