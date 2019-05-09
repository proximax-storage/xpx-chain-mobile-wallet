import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../providers/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formLogin: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public authservice: AuthService,
    public toastController: ToastController,
    private router: Router
  ) {

  }




  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  itemSelected() {
    this.router.navigate(['/register']);
  }

  onSubmit(form) {
    console.log('aqui llegando', form);
    if (this.formLogin.valid) {
      this.authservice.login(form.username, form.password)
        .then(async res => {
          if (res.status === 'success') {
            console.log('exitoso')
            this.router.navigate(['/wallets']);
            this.formLogin.reset();
          } else {
            const toast = await this.toastController.create({
              message: 'incorrect user or password.',
              position: 'top',
              duration: 3000
            });
            toast.present();


          }
        })
        .catch(async err => {

          const toast = await this.toastController.create({
            message: 'unexpected error',
            position: 'top',
            duration: 3000
          });
          toast.present();
        });
    }

  }

}
