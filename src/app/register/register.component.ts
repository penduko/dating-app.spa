import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Input and Output property should always on the top
  @Output() cancelRegister = new EventEmitter();
  user: User;
  // property use to bind the form in the template
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    // allows us to create a form model from configuration
    // and shortned the amount of code to create the form
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    this.createRegisterForm();
  }

  createRegisterForm() {
    // initialize new form group using FormBuilder to simplify
    // the creation of form and pass the
    // controls of the form you can also pass
    // validation in FormGroup or in FormControl
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8)
          ]
        ],
        confirmPass: ['', Validators.required]
      },
      // custom validators
      { validator: this.passwordMatchValidators }
    );
  }

  // pass the FormGroup as parameter so that
  // we can get access to the child controls of
  // the FormGroup
  passwordMatchValidators(form: FormGroup) {
    // if values match return null
    // which means validation effectively pass
    return form.get('password').value === form.get('confirmPass').value
      ? null
      : { mismatch: true };
  }

  register() {
    // check the form
    if (this.registerForm.valid) {
      // assign the form value to actual user
      this.user = Object.assign({}, this.registerForm.value);

      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Registration succesful');
      }, error => {
        this.alertify.error(error);
      }, () => {
        // after registration completes
        // automatically login the user
        // and redirect to members page
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
