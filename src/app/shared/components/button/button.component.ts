import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgIf, FontAwesomeModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() type: string;
  @Input() text?: string;
  @Input() icon?: string;
  @Input() isDisabled: false;
  @Input() btnClass: string;

  @Output() btnClick = new EventEmitter<string>();

  emitEvent() {
    this.btnClick.emit();
  }
}
