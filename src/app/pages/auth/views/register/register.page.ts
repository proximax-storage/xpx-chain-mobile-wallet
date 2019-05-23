import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formReg: FormGroup;
  emailPattern = '^([\\w\\.\\-]{3,39})@[\\w]{2,39}(\\.[\\w]{2,3})+$';
  alfaPattern = '^[a-zA-ZáéíóúÁÉÍÓÚ\\-\']+$';
  alfaNumberPattern = '^[a-zA-Z0-9]+$';
  numberPattern = '^[0-9]+$';
  constructor(
    public formBuilder: FormBuilder,
    public authservice: AuthService,
    public toastController: ToastController
  ) { 

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formReg = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.pattern(this.alfaPattern)]],
      lastname: ['', [Validators.required, Validators.pattern(this.alfaPattern)]],
      emailaddres: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      username: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      confirmpassword: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]]
    });
  }

   onRegister(form) {
    if (this.formReg.valid) {
      this.authservice.register(form.firstname, form.lastname, form.username, form.password)
      .then(async _ => {
        const toast = await this.toastController.create({
          message: 'Successfully registered user.',
          duration: 3000
        });
        toast.present();
        this.formReg.reset();
      })
    }
    // .then(_ => {
    //   this.authProvider.setSelectedAccount(form.email, form.password);
    // });

  }
}
