import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formLogin: FormGroup;
  emailPattern = '^([\\w\\.\\-]{3,39})@[\\w]{2,39}(\\.[\\w]{2,3})+$';
  alfaPattern = '^[a-zA-ZáéíóúÁÉÍÓÚ\\-\']+$';
  alfaNumberPattern = '^[a-zA-Z0-9]+$';
  numberPattern = '^[0-9]+$';
  constructor(
    public formBuilder: FormBuilder,
    public authservice: AuthService,
    public toastController: ToastController,
    private nav: NavController
  ) {

  }
  
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]]
    });
  }

  itemSelected() {
    this.nav.navigateRoot(`/register`);
  }

  onSubmit(form) {
    if (this.formLogin.valid) {
      this.authservice.login(form.username, form.password)
        .then(async res => {
          if (res.status === 'success') {
            this.nav.navigateRoot(['/wallets']);
            this.formLogin.reset();
          } else {
            const toast = await this.toastController.create({
              message: 'incorrect user or password.',
              duration: 3000
            });
            toast.present();
          }
        })
        .catch(async err => {
          const toast = await this.toastController.create({
            message: 'unexpected error',
            duration: 3000
          });
          toast.present();
        });
    }
  }
}
