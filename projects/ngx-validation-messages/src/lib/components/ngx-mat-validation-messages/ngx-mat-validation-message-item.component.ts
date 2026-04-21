import { Component, Input } from '@angular/core';

/**
 * Internal helper component for attribute-mode ngxValidationMessages.
 */
@Component({
  standalone: true,
  selector: 'mat-error',
  template: '{{ message }}',
})
export class NgxMatValidationMessageItemComponent {
  @Input()
  public message = '';
}
