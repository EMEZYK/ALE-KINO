import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
// import { UserStateService } from './core/user.state.service';
import { LoadingStateService } from './shared/components/loader/loader.state.service';
// import { LocalStorageService } from './shared/local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private loadingService = inject(LoadingStateService);
  // private userService = inject(UserStateService);
  // private localStorageService = inject(LocalStorageService);

  loading$: Observable<boolean>;

  ngOnInit(): void {
    // this.userService.user$.subscribe((val) => console.log(val));

    // this.userService.setUser({
    //   role: 'guest',
    //   id: null,
    //   firstName: '',
    //   lastName: '',
    //   email: '',
    // });

    // if (!this.localStorageService.getData('role')) {
    //   this.localStorageService.saveData('role', 'guest');
    // }
    this.loading$ = this.loadingService.loading$;
  }
}
