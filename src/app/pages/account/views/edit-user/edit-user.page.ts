import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthService } from 'src/app/pages/auth/service/auth.service';
import { NavController } from '@ionic/angular';
import { ToastProvider } from 'src/app/providers/toast/toast.provider';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  formEditUser: FormGroup;
  alfaNumberPattern = '^[a-zA-Z0-9 *#$.&]+$';
  user: string;
  name: string;
  lastname: string;
  userservice: string;
  data: any;
  dataUser: any;
  otrosUser: any;
  constructor(
    public formBuilder: FormBuilder,
    private toastProvider: ToastProvider,
    private nav: NavController,
    private storage: Storage,
    public authservice: AuthService
  ) { }

  ngOnInit() {
    this.userservice = this.authservice.user
    this.dataUser = this.authservice.dataUser
    this.otrosUser = this.authservice.otrosUser;
    this.createForm();
  }

  createForm() {
    this.formEditUser = this.formBuilder.group({
      firstname: [this.dataUser.firstname],
      lastname: [this.dataUser.lastname],
      username: [this.dataUser.username],
      oldpassword: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern), Validators.minLength(8), Validators.maxLength(30)]],
      newpassword: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern), Validators.minLength(8), Validators.maxLength(30)]],
      confirmnewpassword: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern), Validators.minLength(8), Validators.maxLength(30)]]
    });
  }

  async onEditar(form) {
    if (form.oldpassword === this.dataUser.password) {
      if (form.newpassword === form.confirmnewpassword) {
        if (this.formEditUser.valid) {
          const user = {
            firstname: form.firstname,
            lastname: form.lastname,
            username: form.username,
            password: form.newpassword,
          }
          this.otrosUser.push(user)
          this.storage.set('accounts', this.otrosUser), this.storage.set('pin', form.newpassword);
          this.toastProvider.showToast('Successfully modified user.')
          this.nav.navigateRoot(['/account'])
        }
      } else {
        this.toastProvider.showToast("Password doesn't match.")
      }
    } else {
      this.toastProvider.showToast('Your password is required.')
    }
  }
}
