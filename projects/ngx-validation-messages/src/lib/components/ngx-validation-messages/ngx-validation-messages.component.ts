import { AfterViewInit, Component, ContentChildren, ElementRef, Inject, Input, QueryList } from '@angular/core';
import { NgxValidatorNameDirective } from '../../directivies/ngx-validator-name.directive';
import {
  NGX_VALIDATION_MESSAGES_CONFIG,
  NgxValidationMessagesConfig
} from '../../interface/ngx-validation-messages.config';
import { NgxValidationMessagesService } from '../../service/ngx-validation-messages.service';
import { NgxCustomMessageComponent } from '../ngx-custom-message/ngx-custom-message.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * Component for displaying validation messages, supports child components of type {@link NgxCustomMessageComponent}
 * and html elements with directive {@link NgxValidatorNameDirective} to override validation messages.
 */
@Component({
  standalone: true,
  selector: 'ngx-validation-messages, [ngxValidationMessages]',
    templateUrl: './ngx-validation-messages.component.html',
    styleUrls: ['./ngx-validation-messages.component.scss'],
    imports: [
        CommonModule,
        MatFormFieldModule,
    ]
})
export class NgxValidationMessagesComponent implements AfterViewInit {

  /**
   * Form control for which need to show validation messages.
   */
  @Input('for')
  public formControl: any;

  /**
   * Contains {@link NgxCustomMessageComponent} if present.
   */
  @ContentChildren(NgxCustomMessageComponent)
  public customMsgComponent: any;

  /**
   * Contains {@link NgxValidatorNameDirective} if present.
   */
  @ContentChildren(NgxValidatorNameDirective)
  public customMsgDirective: any;

  public isMaterialError = false;

  /**
   * Key to get default validation message.
   */
  private defaultError = 'error';

  private materialErrorElement = 'MAT-ERROR';

  constructor(@Inject(NGX_VALIDATION_MESSAGES_CONFIG) public ngxValidationConfig: NgxValidationMessagesConfig,
              private ngxValidationMessagesService: NgxValidationMessagesService,
              private directiveElementRef: ElementRef) {
  }

  public ngAfterViewInit(): void {
    if (this.directiveElementRef && this.directiveElementRef.nativeElement
      && this.directiveElementRef.nativeElement.nodeName) {
      this.isMaterialError = this.materialErrorElement.toLocaleUpperCase()
        === this.directiveElementRef.nativeElement.nodeName.toLocaleUpperCase();
    }
  }

  /**
   * Get all validation messages for specified form control.
   */
  public get errorMessages(): Array<string> {
    const result: Array<string> = [];

    if (!this.formControl || !this.formControl.errors) {
      return result;
    }
    if (this.customMsgComponent && this.customMsgComponent.length > 0) {
      this.processingCustomMessages(this.customMsgComponent);
    }
    if (this.customMsgDirective && this.customMsgDirective.length > 0) {
      this.processingCustomMessages(this.customMsgDirective);
    }

    for (const property in this.formControl.errors) {
      if (this.formControl.errors.hasOwnProperty(property)
        && (this.formControl.touched || this.formControl.dirty)) {
        if (this.formControl.errors[property].customMessages instanceof Array) {
          result.push(...this.formControl.errors[property].customMessages);
          continue;
        }
        if (this.formControl.errors[property].customMessage) {
          result.push(this.formControl.errors[property].customMessage);
          continue;
        }
        const validationMessage: string =
          this.ngxValidationMessagesService.getValidatorErrorMessages(property, this.formControl.errors[property]);
        result.push(validationMessage || this.formControl.errors[property].message
          || this.ngxValidationMessagesService.getValidatorErrorMessages(this.defaultError));
      }
    }
    return result;
  }

  private processingCustomMessages(customMessage: QueryList<any>): void {
    customMessage.forEach((msg: any) => {
      if (!this.formControl.errors[msg.validatorName]) {
        return;
      }
      let message = (msg instanceof NgxCustomMessageComponent)
        ? msg.message.nativeElement.innerText : msg.message;
      message = this.ngxValidationMessagesService.expandParameterizedTemplateMessage(message, this.formControl.errors[msg.validatorName]);

      typeof this.formControl.errors[msg.validatorName] === 'object'
        ? this.formControl.errors[msg.validatorName].customMessage = message
        : this.formControl.errors[msg.validatorName] = {customMessage: message};
    });
  }

}
