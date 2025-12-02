import { Provider } from '@angular/core';
import {
  NGX_VALIDATION_MESSAGES_CONFIG,
  NgxValidationMessagesConfig
} from './interface/ngx-validation-messages.config';

export { NGX_VALIDATION_MESSAGES_CONFIG } from './interface/ngx-validation-messages.config';
export type { NgxValidationMessagesConfig } from './interface/ngx-validation-messages.config';
export { NgxCustomMessageComponent } from './components/ngx-custom-message/ngx-custom-message.component';
export { NgxValidationMessagesComponent } from './components/ngx-validation-messages/ngx-validation-messages.component';
export { NgxValidatorNameDirective } from './directivies/ngx-validator-name.directive';

export function provideNgxValidationMessages(config: NgxValidationMessagesConfig): Provider[] {
  return [
    {
      provide: NGX_VALIDATION_MESSAGES_CONFIG,
      useValue: config
    }
  ];
}
