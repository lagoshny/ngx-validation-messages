import { InjectionToken } from '@angular/core';

export const NGX_VALIDATION_MESSAGES_CONFIG: InjectionToken<NgxValidationMessagesConfig>
  = new InjectionToken<NgxValidationMessagesConfig>('NgxValidationMessagesConfig');

export interface NgxValidationMessagesConfig {

  /**
   * Object contains validation messages in validatorName: validatorMessage format.
   */
  messages: {
    [validatorName: string]: string;
  };

  /**
   * Define custom styles to display validation messages.
   */
  errorMessageStyles?: {
    errorBlockClassNames?: string;
    errorLabelClassNames?: string;
  };

}
