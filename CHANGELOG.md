## 15.0.0 (2025-11-30)
#### Updated angular
Updated to Angular 15.

## 3.0.0 (2021-12-23)
#### Updated angular
Updated to Angular 13.

### ⚠ Breaking changes
>This version supports only from Angular 12 and above that uses `Ivy compilation`.
>
>Angular 13 package tools are [no longer support](https://github.com/ng-packagr/ng-packagr/blob/master/CHANGELOG.md#1300-2021-11-03) old `View Engine` compilation.
Now it uses only `Ivy` compilation.

Now the `lib` have 2 versions for `Angular 6-11` [2.x.x](https://github.com/lagoshny/ngx-validation-messages/tree/lts-view-engine) and `Angular 12-13+` [3.x.x](https://github.com/lagoshny/ngx-validation-messages) that difference between that one is support old `View Engine` compilation, another uses only new `Ivy` compilation.

### Versions that support old `View Engine` compilation will place on [lts-view-engine](https://github.com/lagoshny/ngx-validation-messages/tree/lts-view-engine) branch of the repo.

>I strongly recommend migrating to Angular Ivy compilation and use new lib version, because support two versions is not simple and in future old versions can not be supported.

## 1.1.4 (2021-12-23)
#### Update
Deleted max Angular version.

## 1.1.3 (2021-02-09)
#### Update
Updated to Angular 11 version.

## 1.1.2 (2020-10-30)
#### Update
Updated libs version and refactoring.

## 1.1.0 (2020-06-29)
#### Update
Updated to Angular 10 version.

## 1.0.10 (2020-03-04)
Updated Angular version to Angular 9.

## 1.0.9 (2019-10-30)
Added support to use `ngx-validation-messages` with material ui `mat-form-field` `mat-error` component to display error in standard `ngx-validation-messages` way.

To get more details go to [README.md](https://github.com/lagoshny/ngx-validation-messages#4-with-material-ui-components-using-mat-error-component).

## 1.0.8 (2019-10-13)
Updated Angular version.

## 1.0.7 (2019-08-04)
#### Bug Fixes
Fix readme file

## 1.0.6 (2019-08-04)

#### Features

Added ability to use component `<ngx-validation-messages></ngx-validation-messages>` without component and attribute `for`
to display  error messages passed as child elements.

#### Bug Fixes

Fix error when `for` attribute in `<ngx-validation-messages>` is undefined
