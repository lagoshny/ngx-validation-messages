import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

/**
 * Allow to specify custom validator message to validator override default message.
 *
 * It's alternative for {@link NgxCustomMessageComponent}.
 * If you want to use standard html tags to define custom message, use this directive on html tag within
 * {@link NgxValidationMessagesComponent} specifying validator name as directive parameter,
 * otherwise use {@link NgxCustomMessageComponent}.
 *
 * For example:
 * <ngx-validation-messages>
 *     <div ngxValidatorName='required'>This is filed required!</div>
 * </ngx-validation-messages>
 */
@Directive({
  selector: '[ngxValidatorName]'
})
export class NgxValidatorNameDirective implements AfterViewInit {

  /**
   * The name of the validator for which you want to override the message.
   */
  @Input()
  public validatorName: string;

  /**
   * Contains overridden message for validator.
   */
  public message: string;

  constructor(private elem: ElementRef) {
  }

  public ngAfterViewInit(): void {
    this.message = this.elem.nativeElement.innerText;
  }

}
