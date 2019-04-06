import { Inject, Injectable } from '@angular/core';
import { NGX_VALIDATION_MESSAGES_CONFIG, NgxValidationMessagesConfig } from '../interface/ngx-validation-messages.config';

/**
 * Service allow to get validation messages from client's settings.
 * Inject {@link NgxValidationMessagesConfig} to get client's configuration with validation messages.
 */
@Injectable()
export class NgxValidationMessagesService {

  public static SERVER_ERRORS = 'serverErrors';

  /**
   * Regular expression to find params placeholder '#{paramName}'.
   */
  private paramsRegExp = new RegExp(/#{[a-zA-Z_\\-]*}/);

  constructor(@Inject(NGX_VALIDATION_MESSAGES_CONFIG) private messagesConfig: NgxValidationMessagesConfig) {
  }

  /**
   * Get validation message for specifying validator.
   *
   * @param validatorName for which to get message
   * @param params passed parameters from validator for more detailed validation message
   *
   * @returns string validation message
   */
  public getValidatorErrorMessages(validatorName: string, params?: object): string {

    const validationMessages = this.messagesConfig.messages;
    let validationMessage: string = validationMessages[validatorName];

    if (!validationMessage) {
      throw new Error(`Validation message for validator: ${validatorName} cannot be found,
                       please check validation message key for validator is case sensitive.`);
    }

    // console.log('Contains params are ' + this.paramsRegExp.test(validationMessage));
    if (this.paramsRegExp.test(validationMessage)) {
      const foundParams = this.paramsRegExp.exec(validationMessage);
      // console.log('Found params are ' + JSON.stringify(foundParams));
      foundParams.forEach(value => {
        const paramPlaceholder = value;
        // console.log('Param to replace is ' + JSON.stringify(paramPlaceholder));
        value = value.replace('#{', '').replace('}', '');
        // console.log('Param after replace is ' + JSON.stringify(value));
        validationMessage = validationMessage.replace(paramPlaceholder, this.getParameter(params, value));
      });
    }

    return validationMessage;
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
