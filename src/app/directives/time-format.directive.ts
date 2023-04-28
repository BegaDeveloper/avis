import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatTime]',
})
export class FormatTimeDirective {
  constructor(private element: ElementRef) {}

  @HostListener('input') logChange() {
    let val = this.element.nativeElement.value.replace(/:/g, '');
    val = val.match(/.{1,2}/g).join(':');
    this.element.nativeElement.value = val.substring(0, 5);
  }
}
