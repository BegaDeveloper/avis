import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appDelayedInput]',
})
export class DelayedInputDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input('delayTime') delayTime!: number;
  @Output() delayedInput = new EventEmitter<Event>();

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  ngOnInit() {
    fromEvent(this.elementRef.nativeElement, 'input')
      .pipe(debounceTime(this.delayTime), takeUntil(this.destroy$))
      .subscribe(event => this.delayedInput.emit(event));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
