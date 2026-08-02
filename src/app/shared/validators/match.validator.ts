import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export function matchValidator(
  firstControlName: string,
  secondControlName: string
): ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const firstValue =
      control.get(firstControlName)?.value;

    const secondValue =
      control.get(secondControlName)?.value;

    return firstValue === secondValue
      ? null
      : { valueMismatch: true };

  };

}