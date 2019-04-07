# NgxValidationMessages

####Library requires Angular 2+ version. (updated for Angular 7).

This library allow you decrease boilerplate code when handling validators error messages.

## Startup

In root application module you need import `NgxValidationMessagesModule` and pass configuration which contains validators validation messages:

```
...

import { NgxValidationMessagesModule } from '@p0ntiley/ngx-validation-messages';

@NgModule({
    imports: [
        NgxValidationMessagesModule.forRoot({
            messages: {
                // Key is validator name, value is validator message
                required: 'This is required filed!',
                // If validator takes params, you can specify params placeholder in the validation message
                // to get validator params values for construct more detail message
                maxlength: 'Max count symbols are #[requiredLength]',
                minlength: 'Min count symbols are #[requiredLength]'
                ...
            }
        })
    ]
})
export class AppRootModule {
}
...
```

In other modules when you need to use `<ngx-validation-messages></<ngx-validation-messages>` component, you need simple import
`NgxValidationMessagesModule`:
```
...

import { NgxValidationMessagesModule } from '@p0ntiley/ngx-validation-messages';

@NgModule({
    imports: [
        NgxValidationMessagesModule
    ]
})
export class SomeModule {
}
...
```



## Using `<ngx-validation-messages>` in your templates
### 1. Template driven approach (ngModel)
Usually when you need to show validator message to user you need to do in your component's template something like this:

````
  <input type="text"
         required
         minlength="3"
         [(ngModel)]="user.firstName"
         name="firstName"
         #firstNameVar="ngModel"/>
  <span class="error-block" *ngIf="(firstNameVar.touched || firstNameVar.dirty) && firstNameVar.errors">
    <span *ngIf="firstNameVar.hasError('required')">
      Please enter your first name.
    </span>
    <span *ngIf="firstNameVar.hasError('minlength')">
      The first name must be longer than 3 characters.
    </span>
  </span>
````
And if you add new one validator to firstName input also you will add new <span> blocks with validation message.

Instead of this boilerplate code you can add **<ngx-validation-messages>** component to your html markup and reduce the number of trash code:

```
  <input type="text"
         required
         minlength="3"
         [(ngModel)]="user.firstName"
         name="firstName"
         #firstNameVar="ngModel"/>
  <ngx-validation-messages [for]='firstNameVar'></<ngx-validation-messages>
```

### 2. Form driven approach (reactive)

In this case you will have template like this:

````
  <form [formGroup]="userForm">
    ...
    <input type="text"
           required
           minlength="3"
           formControlName="firstName"/>
    <span class="error-block" *ngIf="(userForm.get('firstName').touched 
                                     || userForm.get('firstName').dirty) && userForm.get('firstName').errors">
      <span *ngIf="userForm.get('firstName').hasError('required')">
        Please enter your first name.
      </span>
      <span *ngIf="userForm.get('firstName').hasError('minlength')">
        The first name must be longer than 3 characters.
      </span>
    </span>
    ...
  </form>
````

There is again a lot of boilerplate code, after using `NgxValidationMessagesComponent` you will get something like this:

````
  <form [formGroup]="userForm">
    ...
    <input type="text"
           required
           minlength="3"
           formControlName="firstName"/>
    <ngx-validation-messages [for]="taskForm.get('firstName')"></ngx-validation-messages>
    ...
  </form>
````
 

## How it works?

In both cases `NgxValidationMessagesComponent` will take validation messages for each applied to form control validator from passed to `NgxValidationMessagesModule` configuration.

If you pass configuration like this:

````
...

  NgxValidationMessagesModule.forRoot({
      messages: {
          required: 'This is required filed!',
          minlength: 'Min count symbols are #[requiredLength]'
      }
  })

...

````
`NgxValidationMessagesComponent` will take **This is required filed!** message for **required** validator
and **Min count symbols are #[requiredLength]** message with parameter placeholder for **minlength** validator. 

**#[requiredLength]** in example above is param placeholder value It means this placeholder will replace to real param passed to **minlength** validator.
##### Note: You need pass correct names for param placeholder, otherwise you will get **undefined** value instead param value.
To get right param names you need check what params return validator when value is not valid.
 
For example: **maxlength, minlength** standard validators pass length param using **requiredLength** name and we can use this name with param placeholder.

## Override validation messages

If you want to specify different message for some validator, you can use one of the following ways to override configured validation messages passed to `NgxValidationMessagesModule`.

#### 1. Use `NgxCustomMessageComponent` to override validation message

To override validation message for some validator, you can use `<ngx-custom-message></ngx-custom-message>` component as child for
 `<ngx-validation-messages></ngx-validation-messages>`:
 
```
  ...
  <input type="text"
         required
         minlength="3"
         [(ngModel)]="user.firstName"
         name="firstName"
         #firstNameVar="ngModel"/>
  <ngx-validation-messages [for]='firstNameVar'>
    // Param forValidator accepts validator name to override message 
    <ngx-custom-message forValidator='minlength'>
      Min lenth for first name is #[requiredLength]
    </ngx-custom-message>
  </<ngx-validation-messages>
  ...
```
In this case for **required** validator will be used configured **'This is required filed!'** message, but for
**minlength** validator will be used overridden **'Min lenth for first name is #[requiredLength]'** message, **note** that 
we can also use params placeholder in validation message.

#### 2. Use `NgxValidatorNameDirective` to override validation message

The second way to override message is using directive on child  `<ngx-validation-messages></ngx-validation-messages>` html tag:

```
  ...
  <input type="text"
         required
         minlength="3"
         [(ngModel)]="user.firstName"
         name="firstName"
         #firstNameVar="ngModel"/>
  <ngx-validation-messages [for]='firstNameVar'>
     // Directive accepts param as validator name to override message 
    <span ngxValidatorName='minlength'>
      Min lenth for first name is #[requiredLength]
    </span>
  </<ngx-validation-messages>
  ...
```

## Custom message styles

If you want to change default validation message styles, you can set custom css classes in `NgxValidationMessagesModule` as optional param:

```
...

  NgxValidationMessagesModule.forRoot({
      messages: {
          required: 'This is required filed!',
          minlength: 'Min count symbols are #[requiredLength]'
      },
      errorMessageStyles: {
          errorBlockClassNames: 'your_err_block_css_class1 your_err_block_css_class2';
          errorLabelClassNames: 'your_err_label_css_class1 your_err_label_css_class2';
      }
  })

...
```

## Custom validators

If you want to write custom validator you need return validation result in right a format with validation params if they exist.

Suppose you write **range** validator to check that input string length satisfies the specified range.
Your validator takes 2 parameters **min** and **max** and compare with string length, if string length doesn't pass condition you need to return error object which contains passed **min**, **max** params:

```
...

    public static range(min: number, max: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors => {
            if (min === undefined || max === undefined) {
                return;
            }
            const value = control.value as string;
            if (!value) {
                return undefined;
            }

            if (value.length < min || value.length > max) {
                return {
                // Use validator name as key for returning object it
                // will simplify the definition of validation messages
                    range: {
                        // Put passed params to validator error answer, and you can access to this params
                        // in validation message use #[min], #[max] placeholders
                        max,
                        min
                    }
                };
            }

            // When validation passed you need return null or undefined result
            return undefined;
        };
    }

...
```

After that you can define validation message for range validator like this:

```
...

  NgxValidationMessagesModule.forRoot({
      messages: {
      // You use validator name as range because you return error object with key 'range'
      // also you can use params placeholders returned in error 'range' object from validator
          range: 'The string must be at least #[min] and no more than #[max] characters.',
      }
  })

...
```

## TODO

- Apply to form controls server validation messages
