import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserHomePageComponent {
  constructor() {
    return;
  }
}
