import { FormGroup, AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormErrorService {
    patternMap = {
        '^[0-9]{13}$': " must be 13 characters long",
        '^[a-zA-Z]{3,}$': " must have at least 3 characters, and can't contain white space",
        '^[0-9]$': " must be number",
        '^[a-zA-Z]$': " must be letter",
        "^(?!@.*$).*$": "must not start with @"
    }

    errorMap: {
        [key: string]: (c: AbstractControl, name: string) => string
    } = {
            'required': (c: AbstractControl, name: string) => `${name} is required`,
            'email': (c: AbstractControl, name: string) => `${c.value} is not a valid email`,
            'maxlength': (c: AbstractControl, name: string) => `${name} can't have more than ${c.errors['minlength']['requiredLength']} characters`,
            'minlength': (c: AbstractControl, name: string) => `${name} must have at least ${c.errors['minlength']['requiredLength']} characters`,
            'mustMatch': (c: AbstractControl, name: string) => `${name} must match password`,
            'invalidMimeType': (c: AbstractControl, name: string) => `Invalid type, only png and jpg are supported for ${name}`,
            'pattern'(c: AbstractControl, name: string) {
                return `${name} ${this.patternMap[c.errors['pattern']['requiredPattern']]}`
            }
        }

    mapErrors(control: AbstractControl, name: string): string {
        for (let i = 0; i < Object.keys(control.errors || {}).length; i++) {
            if (this.errorMap[Object.keys(control.errors || {})[0]]) {
                return this.errorMap[Object.keys(control.errors || {})[0]].bind(this)(control, name);
            }
            return "Unsupported error";
        }
    }

    markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

}