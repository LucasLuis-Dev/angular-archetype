import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
  standalone: true
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null) {
    if (!target) return;
    
    const clickedInside = this.elementRef.nativeElement.contains(target as Node);
    
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
}