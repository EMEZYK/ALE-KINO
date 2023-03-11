import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingStateService } from './shared/components/loader/loader.state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private loadingService = inject(LoadingStateService);

  loading$: Observable<boolean>;

  ngOnInit(): void {
    // setTimeout(() => {
    this.loading$ = this.loadingService.loading$;
    // }, 0);
  }
}
