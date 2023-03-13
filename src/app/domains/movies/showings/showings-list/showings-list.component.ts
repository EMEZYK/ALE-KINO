import { NgFor, AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Observable } from 'rxjs';

import { Showing } from '../../movie.interface';

@Component({
  selector: 'app-showings-list',
  templateUrl: './showings-list.component.html',
  styleUrls: ['./showings-list.component.css'],
  standalone: true,
  imports: [MatDividerModule, MatListModule, NgFor, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowingsListComponent {
  @Input() showings: Observable<Showing[]>;
}
