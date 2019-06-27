import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { NavController } from '@ionic/angular';
import { ToastProvider } from 'src/app/providers/toast/toast.provider';

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
  alfaNumberPatternP = '^[a-zA-Z0-9 *#$.&]+$';
  numberPattern = '^[0-9]+$';
  constructor(
    public formBuilder: FormBuilder,
    public authservice: AuthService,
    private toastProvider: ToastProvider,
    private nav: NavController
  ) {

  }
  
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.alfaNumberPatternP)]]
    });
  }

  itemSelected() {
    this.nav.navigateRoot(`/register`);
  }

  onSubmit(form) {
    if (this.formLogin.valid) {
      this.authservice.login(form.username, form.password)
        .then(res => {
          console.log('res', res)
          if (res.status === 'success') {
            this.toastProvider.showToast(res.message)
            this.nav.navigateRoot(['/wallets']);
            this.formLogin.reset();
          } else {
            this.toastProvider.showToast(res.message)
          }
        })
        .catch( err => {
          this.toastProvider.showToast(err)
        });
    }
  }
}
