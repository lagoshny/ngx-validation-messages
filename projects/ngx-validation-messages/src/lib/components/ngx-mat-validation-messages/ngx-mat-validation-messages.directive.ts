import {
  ComponentRef,
  Directive,
  DoCheck,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
  ViewContainerRef
} from '@angular/core';
import { NgxValidationMessagesBase } from '../base/ngx-validation-messages-base.directive';
import { NgxMatValidationMessageItemComponent } from './ngx-mat-validation-message-item.component';

/**
 * Attribute directive for Material form fields.
 * Usage: <mat-error ngxValidationMessages [for]="form.get('email')"></mat-error>
 */
@Directive({
  standalone: true,
  selector: 'mat-error[ngxValidationMessages]'
})
export class NgxMatValidationMessagesDirective extends NgxValidationMessagesBase implements DoCheck, OnDestroy {
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly hostElementRef = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private renderedMessages: string[] = [];
  private dynamicMessageComponents: ComponentRef<NgxMatValidationMessageItemComponent>[] = [];

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
    this.syncAdditionalMessageComponents(messages.slice(1));
  }

  private syncAdditionalMessageComponents(messages: string[]): void {
    while (this.dynamicMessageComponents.length < messages.length) {
      this.dynamicMessageComponents.push(
        this.viewContainerRef.createComponent(NgxMatValidationMessageItemComponent),
      );
    }

    while (this.dynamicMessageComponents.length > messages.length) {
      const componentRef = this.dynamicMessageComponents.pop();
      componentRef?.destroy();
    }

    const hostElement = this.hostElementRef.nativeElement;
    const parentElement = hostElement.parentNode;

    let previousNode: Node = hostElement;
    this.dynamicMessageComponents.forEach((componentRef, index) => {
      componentRef.setInput('message', messages[index]);
      componentRef.changeDetectorRef.detectChanges();

      if (!parentElement) {
        return;
      }

      const dynamicHostNode: Node = componentRef.location.nativeElement;
      this.renderer.insertBefore(parentElement, dynamicHostNode, previousNode.nextSibling);
      previousNode = dynamicHostNode;
    });
  }

  private destroyDynamicMessageComponents(): void {
    this.dynamicMessageComponents.forEach((componentRef) => {
      componentRef.destroy();
    });
    this.dynamicMessageComponents = [];
  }

  private resetRenderedMessages(): void {
    if (this.renderedMessages.length === 0 && this.dynamicMessageComponents.length === 0) {
      return;
    }
    this.renderedMessages = [];
    this.renderer.setProperty(this.hostElementRef.nativeElement, 'textContent', '');
    this.destroyDynamicMessageComponents();
  }

  private isEqualMessageSet(previous: string[], current: string[]): boolean {
    if (previous.length !== current.length) {
      return false;
    }
    return previous.every((message, index) => message === current[index]);
  }
}
