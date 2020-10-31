import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxCustomMessageComponent } from './components/ngx-custom-message/ngx-custom-message.component';
import { NgxValidationMessagesComponent } from './components/ngx-validation-messages/ngx-validation-messages.component';
import { NgxValidatorNameDirective } from './directivies/ngx-validator-name.directive';
import { NGX_VALIDATION_MESSAGES_CONFIG, NgxValidationMessagesConfig } from './interface/ngx-validation-messages.config';
import { NgxValidationMessagesService } from './service/ngx-validation-messages.service';

export { NGX_VALIDATION_MESSAGES_CONFIG, NgxValidationMessagesConfig } from './interface/ngx-validation-messages.config';
export { NgxCustomMessageComponent } from './components/ngx-custom-message/ngx-custom-message.component';
export { NgxValidationMessagesComponent } from './components/ngx-validation-messages/ngx-validation-messages.component';
export { NgxValidatorNameDirective } from './directivies/ngx-validator-name.directive';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule
  ],
  declarations: [
    NgxValidationMessagesComponent,
    NgxCustomMessageComponent,
    NgxValidatorNameDirective
  ],
  exports: [
    NgxValidationMessagesComponent,
    NgxCustomMessageComponent,
    NgxValidatorNameDirective
  ]
})
export class NgxValidationMessagesModule {
  static forRoot(config: NgxValidationMessagesConfig): ModuleWithProviders<NgxValidationMessagesModule> {
    return {
      ngModule: NgxValidationMessagesModule,
      providers: [
        NgxValidationMessagesService,
        {
          provide: NGX_VALIDATION_MESSAGES_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
