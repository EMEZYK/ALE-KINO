import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]',
  standalone: true,
})
export class NumberDirective {
  private elRef = inject(ElementRef);

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initalValue = this.elRef.nativeElement.value;

    this.elRef.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');

    if (initalValue !== this.elRef.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
