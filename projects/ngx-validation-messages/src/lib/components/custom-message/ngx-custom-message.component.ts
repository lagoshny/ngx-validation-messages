import { Component, ElementRef, Input, ViewChild } from '@angular/core';

/**
 * Component allow to specify custom validator validation message override default message.
 * Using this component into {@see NgxValidationMessagesComponent}.
 *
 * For example:
 * <ngx-validation-messages>
 *     <ngx-custom-message forValidator='required'>This is filed required!</ngx-custom-message>
 * </ngx-validation-messages>
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
