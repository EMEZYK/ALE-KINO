import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgIf, FontAwesomeModule, MatButtonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
