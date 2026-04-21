import { Component } from '@angular/core';
import { NgxValidatorNameDirective } from '../../directivies/ngx-validator-name.directive';
import { NgxCustomMessageComponent } from '../ngx-custom-message/ngx-custom-message.component';
import { CommonModule } from '@angular/common';
import { NgxValidationMessagesBase } from '../base/ngx-validation-messages-base.directive';

/**
 * Component for displaying validation messages, supports child components of type {@link NgxCustomMessageComponent}
 * and html elements with directive {@link NgxValidatorNameDirective} to override validation messages.
 */
@Component({
  standalone: true,
  selector: 'ngx-validation-messages',
    templateUrl: './ngx-validation-messages.component.html',
    styleUrls: ['../base/ngx-validation-messages.component.scss'],
    imports: [
        CommonModule,
    ]
})
export class NgxValidationMessagesComponent extends NgxValidationMessagesBase {}
