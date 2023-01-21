import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
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
