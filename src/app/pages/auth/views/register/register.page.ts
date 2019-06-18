import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { NavController } from '@ionic/angular';
import { ToastProvider } from 'src/app/providers/toast/toast.provider';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  formReg: FormGroup;
  emailPattern = '^([\\w\\.\\-]{3,39})@[\\w]{2,39}(\\.[\\w]{2,3})+$';
  alfaPattern = '^[a-zA-ZáéíóúÁÉÍÓÚ\\-\' ]+$';
  alfaNumberPattern = '^[a-zA-Z0-9]+$';
  alfaNumberPatternP = '^[a-zA-Z0-9 *#$.&]+$';
  numberPattern = '^[0-9]+$';
  constructor(
    public formBuilder: FormBuilder,
    public authservice: AuthService,
    private nav: NavController,
    private toastProvider: ToastProvider
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formReg = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern(this.alfaPattern), Validators.minLength(3), Validators.maxLength(30)]],
      lastname: ['', [Validators.required, Validators.pattern(this.alfaPattern), Validators.minLength(3), Validators.maxLength(30)]],
      // emailaddres: ['', [Validators.required, Validators.pattern(this.emailPattern), Validators.minLength(10), Validators.maxLength(20)]],
      username: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern), Validators.minLength(3), Validators.maxLength(10)]],
      password: ['', [Validators.required, Validators.pattern(this.alfaNumberPatternP), Validators.minLength(8), Validators.maxLength(30)]],
      confirmpassword: ['', [Validators.required, Validators.pattern(this.alfaNumberPatternP), Validators.minLength(8), Validators.maxLength(30)]]

    });
  }

  async onRegister(form) {
    if (this.formReg.valid) {
      if (form.password === form.confirmpassword) {
        this.authservice.register(form.firstname, form.lastname, form.username, form.password)
          .then(async status => {
            if(status === "duplicate") {
              this.toastProvider.showToast('user already exist. Please try again.')
            } else {
              this.toastProvider.showToast('Successfully registered user.')
              this.formReg.reset();
              this.nav.navigateRoot(`/login`);
            }
          });
      } else {
        this.toastProvider.showToast("Password doesn't match.")
      }
    }
  }
}
