import { Inject, Injectable } from '@angular/core';
import { NGX_VALIDATION_MESSAGES_CONFIG, NgxValidationMessagesConfig } from '../interface/ngx-validation-messages.config';

/**
 * Service allows getting validation messages from client's settings.
 * Injecting {@link NgxValidationMessagesConfig} to get client's configuration with validation messages.
 */
@Injectable()
export class NgxValidationMessagesService {

  public static SERVER_ERRORS = 'serverErrors';

  /**
   * Regular expression to find params placeholder '#[paramName]'.
   */
  private paramsRegExp = new RegExp(/#[[a-zA-Z_\\-]*]/);

  constructor(@Inject(NGX_VALIDATION_MESSAGES_CONFIG) private messagesConfig: NgxValidationMessagesConfig) {
  }

  /**
   * Get validation message for specified validator.
   *
   * @param validatorName for which to get message
   * @param params passed from validator for more detailed validation message
   *
   * @returns string validation message
   */
  public getValidatorErrorMessages(validatorName: string, params?: object): string {
    const validationMessages = this.messagesConfig.messages;
    const validationMessage: string = validationMessages[validatorName];

    if (!validationMessage) {
      throw new Error('Validation message for validator: ' + validatorName
        + ' cannot be found, please check validation message key for validator it is case sensitive.');
    }

    if (params) {
      return this.expandParameterizedTemplateMessage(validationMessage, params);
    }

    return validationMessage;
  }

  public expandParameterizedTemplateMessage(msg: string, params: object): string {
    while (this.paramsRegExp.test(msg)) {
      const foundParams = this.paramsRegExp.exec(msg);
      foundParams.forEach(value => {
        const paramPlaceholder = value;
        value = value.replace('#[', '').replace(']', '');
        msg = msg.replace(paramPlaceholder, this.getParameter(params, value));
      });
    }

    return msg;
  }

  /**
   * A utilitarian method to get a property from an object.
   * if there is no property, an empty string is returned.
   *
   * @param obj from which the property must be obtained
   * @param prop property name
   *
   * @return property value or empty string
   */
  private getParameter(obj: object, prop: string): string {
    return prop.split('.')
      .reduce((m, i) => {
        return m && typeof m === 'object' ? m[i] : '';
      }, obj);
  }

  // public static applyServerError(control: AbstractControl | null, serverError: ServerError): void {
  //   if (!control) {
  //     return;
  //   }
  //   if (control.getError(NgxValidationMessagesService.SERVER_ERRORS)) {
  //     const existingErrorMessages = control.getError(NgxValidationMessagesService.SERVER_ERRORS);
  //     if (_.isArray(existingErrorMessages.customMessages) &&
  //       existingErrorMessages.customMessages.indexOf(serverError.message) === -1) {
  //       existingErrorMessages.customMessages.push(serverError.message);
  //     }
  //   } else {
  //     control.setErrors({[NgxValidationMessagesService.SERVER_ERRORS]: {customMessages: [serverError.message]}});
  //   }
  //   control.markAsTouched();
  // }

}
