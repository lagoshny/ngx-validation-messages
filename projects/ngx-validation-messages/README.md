# Library for convenient display validators validation messages

#### Library work with Angular 2+ version. (updated for Angular 7).

This library allows you to decrease boilerplate code when handling validations error messages.
## Getting started

### Installation
```
npm install @lagoshny/ngx-validation-messages --save
```

### Configuration
To work with main `NgxValidationMessagesComponent` which decrease boilerplate validation code you need
in the root application module import `NgxValidationMessagesModule`  passing configuration which contains  validation messages for validators:
```typescript
// ...
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';

@NgModule({
    imports: [
        NgxValidationMessagesModule.forRoot({
            messages: {
                // Key is validator name, value is validator message
                required: 'This is required filed!',
                // If validator gets params, you can specify params placeholder in the validation message
                // to get validator params values for constructing more detail message
                maxlength: 'Max count symbols are #[requiredLength]',
                minlength: 'Min count symbols are #[requiredLength]'
            }
        })
    ]
})
export class AppRootModule {
}
// ...
```

In other modules where you want to use `NgxValidationMessagesComponent`, you need simple import
`NgxValidationMessagesModule`:
```typescript
// ...
import { NgxValidationMessagesModule } from '@lagoshny/ngx-validation-messages';

@NgModule({
    imports: [
        NgxValidationMessagesModule
    ]
})
export class SomeModule {
}
// ...
```
After that you can use the `NgxValidationMessagesComponent` in your templates, about it see below.


### Usage
#### 1. Template driven approach (ngModel)
Usually, when you need to show validation message to a user you need to do in your component's template something like this:
````html
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
And if you add new one validator to firstName input also you need to add new <span> blocks with validation message.

Instead of this boilerplate code you can add `<ngx-validation-messages>` component to your HTML markup and reduce the number of trash code:

```html
  <input type="text"
         required
         minlength="3"
         [(ngModel)]="user.firstName"
         name="firstName"
         #firstNameVar="ngModel"/>
  <ngx-validation-messages [for]='firstNameVar'></ngx-validation-messages>
```

#### 2. Form driven approach (reactive)

In reactive approach you define a component class which building form controls and apply control validators:

```typescript
@Component(
  // ...
)
export class UserFormComponent {

    public userForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.userForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(3)]]
        });
    }
    
}
```

For defined above component class you will have a HTML template like this:

````html
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


As you can see there is again a lot of boilerplate code.
 
You can decrease it using `NgxValidationMessagesComponent`:

````html
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

In both cases `NgxValidationMessagesComponent` will get validation messages for each applied to form control validator from passed configuration object to `NgxValidationMessagesModule` 

For example, if you pass configuration like this:

````typescript
//...

  NgxValidationMessagesModule.forRoot({
      messages: {
          required: 'This is required filed!',
          minlength: 'Min count symbols are #[requiredLength]'
      }
  })

//...

````
`NgxValidationMessagesComponent` will get ***This is required filed!*** message for **required** validator
and ***Min count symbols are #[requiredLength]*** message with parameter placeholder for **minlength** validator. 

- **#[requiredLength]** in the example above is param placeholder value It means this placeholder will replace to real param passed to **minlength** validator.

##### Note: You need to pass correct names for param placeholder, otherwise you will get `undefined` value instead param value.

To get right param names you need to check what params returns concrete validator when a value is not valid. 


For example **maxlength or minlength** standard validators return passed length param in validation result using **requiredLength** name and we can use its name with param placeholder in a validation message.

## Override configured validation messages

If you want to specify a different message for some validator in the concrete HTML template you can use one of the following ways to override configured validation messages passed to `NgxValidationMessagesModule`.

#### 1. Use `NgxCustomMessageComponent` to override validation message with custom HTML-tag component

To override validation message for some validator, you can use `<ngx-custom-message></ngx-custom-message>` component as child for
 `<ngx-validation-messages></ngx-validation-messages>`:
 
```html
  ...
  <input type="text"
         required
         minlength="3"
         [(ngModel)]="user.firstName"
         name="firstName"
         #firstNameVar="ngModel"/>
  <ngx-validation-messages [for]='firstNameVar'>
    <!-- Param forValidator accepts validator name to override message -->
    <ngx-custom-message forValidator='minlength'>
      Min length for first name is #[requiredLength]
    </ngx-custom-message>
  </ngx-validation-messages>
  ...
```
In this case, for **required** validator will be used configured ***This is required filed!*** message, but for
**minlength** validator will be used overridden ***Min length for first name is #[requiredLength]*** message 
instead of defined in the configuration ***Min count symbols are #[requiredLength]*** .
 
##### Note: we can also use params placeholder in redefined a validation message in the same way as in the configuration object.

#### 2. Use `NgxValidatorNameDirective` to override validation message with standard HTML-tag component

The second way to override message is using directive applied to child  `<ngx-validation-messages></ngx-validation-messages>` HTML tag:

```html
  ...
  <input type="text"
         required
         minlength="3"
         [(ngModel)]="user.firstName"
         name="firstName"
         #firstNameVar="ngModel"/>
  <ngx-validation-messages [for]='firstNameVar'>
     <!-- Directive parameter accepts a validator name to override message -->
    <span ngxValidatorName='minlength'>
      Min length for first name is #[requiredLength]
    </span>
  </ngx-validation-messages>
  ...
```

## Custom display validation messages styles

If you want to change display default validation message styles, you can set custom CSS classes in the passed configuration for  `NgxValidationMessagesModule` use optional param ***validationMessagesStyle***:
```typescript
//...

  NgxValidationMessagesModule.forRoot({
      messages: {
          required: 'This is required filed!',
          minlength: 'Min count symbols are #[requiredLength]'
      },
      validationMessagesStyle: {
          // Styles for changing the view of a validation message block
          blockClassNames: 'your_block_css_class1 your_block_css_class2',
          // Styles for changing the view of validation message text inside message block
          textClassNames: 'your_text_css_class1 your_text_css_class2'
      }
  })

//...
```

## Writing Custom validators

If you want to write custom validator then for working `NgxValidationMessagesComponent` you need to follow some rule: **returned validation result should be in the following formats**:

- if validator **with/without** parameters and validation was **success** then validator should return `null` or `undefined`

- if validator **with** parameters and validation was **not success** then validator should return an object which contains `validator name` as key and `passed to validator params` as value. 
For example for `range` validator you will return `{ range: {min, max} }` where `min` and `max` passed to validator params
These params you can get in validation message using params placeholder.

- if validator **without** parameters and validation was **not success** then validator should return an object which contains `validator name` as key and `true` as value.
For example for `passwordMatch` validator you will return `{ passwordMatch: true }` 

##### Note: returned `validator name` as key is key for define validation message to this validator in configuration.
For example for described above cases you will use `range` and `passwordMatch` as keys to define validation message.

### Example custom validator
Suppose you write **range** validator to check that input string length satisfies the specified range.
Your validator takes 2 parameters **min** and **max** and compare with string length, if string length doesn't pass condition you need to return error object which contains passed **min**, **max** params:

```typescript
//...

    function range(min: number, max: number): ValidatorFn {
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
                // will use to define validation message
                    range: {
                        // Put passed params to validator error answer and you can access to this params
                        // in validation message use #[min], #[max] placeholders
                        max,
                        min
                    }
                };
            }

            return undefined;
        };
    }

//...
```

After that you can define validation message for range validator like this:

```typescript
//...

  NgxValidationMessagesModule.forRoot({
      messages: {
          // You use validator name as range because you return error object with key 'range'
          // also you can use params placeholders returned in error 'range' object
          range: 'The string must be at least #[min] and no more than #[max] characters.',
      }
  })

//...
```

## Further improvements

- Apply server validation messages to form controls
