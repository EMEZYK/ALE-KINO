import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownItems } from './dropdown.interface';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
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
