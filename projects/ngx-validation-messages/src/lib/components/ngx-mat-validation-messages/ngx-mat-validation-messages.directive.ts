import { Directive, DoCheck, ElementRef, inject, OnDestroy, Renderer2 } from '@angular/core';
import { NgxValidationMessagesBase } from '../base/ngx-validation-messages-base.directive';

/**
 * Attribute directive for Material form fields.
 * Usage: <mat-error ngxValidationMessages [for]="form.get('email')"></mat-error>
 */
@Directive({
  standalone: true,
  selector: 'mat-error[ngxValidationMessages]'
})
export class NgxMatValidationMessagesDirective extends NgxValidationMessagesBase implements DoCheck, OnDestroy {
  private readonly hostElementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private renderedMessages: string[] = [];
  private dynamicMessageElements: HTMLElement[] = [];

  public ngDoCheck(): void {
    if (!this.formControl) {
      this.resetRenderedMessages();
      return;
    }

    const currentMessages = this.errorMessages;
    if (this.isEqualMessageSet(this.renderedMessages, currentMessages)) {
      return;
    }

    this.renderedMessages = [...currentMessages];
    this.renderMessages(currentMessages);
  }

  public ngOnDestroy(): void {
    this.resetRenderedMessages();
  }

  private renderMessages(messages: string[]): void {
    const hostElement = this.hostElementRef.nativeElement;
    this.renderer.setProperty(hostElement, 'textContent', messages[0] ?? '');
    this.syncAdditionalMessageElements(messages.slice(1));
  }

  private syncAdditionalMessageElements(messages: string[]): void {
    while (this.dynamicMessageElements.length < messages.length) {
      this.dynamicMessageElements.push(this.createDynamicMatErrorElement());
    }

    while (this.dynamicMessageElements.length > messages.length) {
      const errorElement = this.dynamicMessageElements.pop();
      if (errorElement?.parentNode) {
        this.renderer.removeChild(errorElement.parentNode, errorElement);
      }
    }

    const hostElement = this.hostElementRef.nativeElement;
    const parentElement = hostElement.parentNode;

    let previousNode: Node = hostElement;
    this.dynamicMessageElements.forEach((errorElement, index) => {
      this.renderer.setProperty(errorElement, 'textContent', messages[index]);

      if (!parentElement) {
        return;
      }

      this.renderer.insertBefore(parentElement, errorElement, previousNode.nextSibling);
      previousNode = errorElement;
    });
  }

  private createDynamicMatErrorElement(): HTMLElement {
    const errorElement = this.renderer.createElement('mat-error') as HTMLElement;
    const hostClasses = this.hostElementRef.nativeElement.className;
    if (hostClasses) {
      this.renderer.setAttribute(errorElement, 'class', hostClasses);
    }
    return errorElement;
  }

  private destroyDynamicMessageElements(): void {
    this.dynamicMessageElements.forEach((errorElement) => {
      if (errorElement.parentNode) {
        this.renderer.removeChild(errorElement.parentNode, errorElement);
      }
    });
    this.dynamicMessageElements = [];
  }

  private resetRenderedMessages(): void {
    if (this.renderedMessages.length === 0 && this.dynamicMessageElements.length === 0) {
      return;
    }
    this.renderedMessages = [];
    this.renderer.setProperty(this.hostElementRef.nativeElement, 'textContent', '');
    this.destroyDynamicMessageElements();
  }

  private isEqualMessageSet(previous: string[], current: string[]): boolean {
    if (previous.length !== current.length) {
      return false;
    }
    return previous.every((message, index) => message === current[index]);
  }
}
