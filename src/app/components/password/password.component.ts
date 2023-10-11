import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {

  constructor(private fb: FormBuilder) {}

  public lettersRegex = /[a-zA-Z]/
  public digitsRegex = /(?=.*[0-9])/;
  public symbolsRegex = /(?=.*?[#?!@$ %^&*-])/;

  public passwordState = {
      includesLetters: false,
      includesDigits: false,
      includesSymbols: false,
      passVisible: false,
  }

  public passwordStrengthState = {
    weak:   <null | boolean> null,
    medium: <null | boolean> null,
    strong: <null | boolean> null,
  }

  passForm = new FormGroup({
    password: new FormControl("", Validators.compose([
      Validators.required,
      Validators.minLength(8),

    ])),
  })

  public setPassword(event: any) {
    const target = (event.target) as HTMLInputElement;
    this.passForm.get("password")?.setValue(target.value);
    const passToCheck = this.passForm.get("password")?.value;
    if (passToCheck) {
      this.checkPassword(passToCheck)
    }  
  }

  public checkPassword(password: string) {

    this.passwordState.includesLetters = false;
    this.passwordState.includesDigits = false;
    this.passwordState.includesSymbols = false;

    for (let i = 0; i < password.length; i++) {
      const char = password[i] 
      if (this.lettersRegex.test(char)) {
        this.passwordState.includesLetters = true;
      } else if (this.digitsRegex.test(char)) {
        this.passwordState.includesDigits = true;
      } else if (this.symbolsRegex.test(char)) {
        this.passwordState.includesSymbols = true;
      }
    }

    this.determinePasswordStrength();
    this.getFieldClass();
  }

  public determinePasswordStrength() {
    if (this.passwordState.includesLetters && this.passwordState.includesDigits && this.passwordState.includesSymbols) {
      this.passwordStrengthState.strong = true;
      this.passwordStrengthState.medium = false;
      this.passwordStrengthState.weak = false;

    } else if (this.passwordState.includesLetters && this.passwordState.includesDigits 
      || this.passwordState.includesLetters && this.passwordState.includesSymbols || this.passwordState.includesDigits && this.passwordState.includesSymbols) {
        this.passwordStrengthState.medium = true;
        this.passwordStrengthState.weak = false;
        this.passwordStrengthState.strong = false;
    } else {
      this.passwordStrengthState.weak = true;
      this.passwordStrengthState.medium = false;
      this.passwordStrengthState.strong = false;
    }
  }

  public getFieldClass() {
  const pass = this.passForm.get("password")?.value;
  if (!pass) {
    return 'pass-strength-field';
  } else if (pass.length < 8) {
      return 'pass-short'
  } else if (this.passwordStrengthState.medium) {
      return 'pass-medium'
  } else if (this.passwordStrengthState.strong) {
      return 'pass-strong'
  } 
  else {
    return 'pass-weak'
  }
}

public togglePassVisibility() {
  this.passwordState.passVisible = !this.passwordState.passVisible;
}

}


