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
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      emailaddres: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    });
  }

   onRegister(form) {
    console.log("aqui llegando", form)
    if (this.formReg.valid) {
      console.log("aqui valido")
      this.authservice.register(form.firstname, form.lastname, form.username, form.password)
      .then(async _ => {
        console.log("registrado con exito toast")
        const toast = await this.toastController.create({
          message: 'Successfully registered user.',
          position: 'top',
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
