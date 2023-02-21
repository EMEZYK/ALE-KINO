import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appNoWhitespace]',
  standalone: true,
})
export class NoWhiteSpaceDirective {
  private elRef = inject(ElementRef);

  @HostListener('input') onInput() {
    const input = this.elRef.nativeElement as HTMLInputElement;

    if (input) {
      this.elRef.nativeElement.value = input.value.trim();
    }
  }
}
