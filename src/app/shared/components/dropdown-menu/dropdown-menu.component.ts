import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DropdownItems } from './dropdown.interface';
import { RouterModule } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [NgFor, NgIf, RouterModule],
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
  @Input() isDropdownOpen: boolean;
  @Input() dropdownOptions: [];
  @Output() buttonClick = new EventEmitter<{}>();

  onClick(option: DropdownItems) {
    if (option.shouldLogOut) {
      this.buttonClick.emit();
    }
    this.isDropdownOpen = false;
  }
}
