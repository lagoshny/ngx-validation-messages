import { Component, ElementRef, Input, ViewChild } from '@angular/core';

/**
 * Component allows specifying custom validation message for the specified
 * validator to override default message.
 *
 * Use this component as child in {@link NgxValidationMessagesComponent}.
 */
@Component({
  selector: 'ngx-custom-message',
  template: `
    <div #message>
      <ng-content></ng-content>
    </div>`
})
export class NgxCustomMessageComponent {

  /**
   * The name of the validator for which you want to override the message.
   */
  @Input('forValidator')
  public validatorName: string;

  /**
   * Contains overridden message for validator.
   */
  @ViewChild('message')
  public message: ElementRef;

}
