import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../providers/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  formLogin: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    public authservice: AuthService,
    public toastController: ToastController,
    private router: Router
    ){
      
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

  onSubmit(form) {
    console.log("aqui llegando", form)
    if (this.formLogin.valid) {
      this.blockUI.start();
      this.authservice.login(form.username, form.password)
      .then(async res => {
        if (res.status === 'success') {
          setTimeout(() => {
            this.blockUI.stop();
            this.router.navigate(['/wallets']); 
          }, 2500);
          this.formLogin.reset();
          // this.authProvider
          //   .setSelectedAccount(form.email, form.password)
          //   .then(_ => {
          //     setTimeout(() => {
          //       this.gotoHome();
          //     }, 1000);
          //   });
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
          message: 'unexpected error.',
          position: 'top',
          duration: 3000
        });
        toast.present();
      });
    }
  
  }

}
