import { FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static isNotValidField(form: FormGroup, fieldName: string): boolean | null {
    return !!form.controls[fieldName].errors && form.controls[fieldName].touched;
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  private static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'minlength':
          return `The minimum length is ${errors['minlength'].requiredLength} characters`;
        case 'maxlength':
          return `The maximum length is ${errors['maxlength'].requiredLength} characters`;
        case 'min':
          return `The minimum value is ${errors['min'].min}`;
        case 'max':
          return `The maximum value is ${errors['max'].max}`;
        case 'email':
          return `The email format entered is not valid`;
        case 'pattern':
          const pattern = errors['pattern'].requiredPattern;                    
          if (pattern === '/^[0-9]*$/') {
            return 'Only whole numbers are allowed';
          }          
          // para validar formato fecha
          if (pattern === '/^\\d{4}-\\d{2}-\\d{2}$/') {
            return 'The date must be in yyyy-mm-dd or dd-mm-yyyy format';
          }          
          //validar formato password
          if (pattern === '/(?:(?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/') {
            return 'The password must have a Uppercase, lowercase letter and a number';
          }          
          return 'The entered format is not valid';
      }
    }
    return null;
  }
}
