import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { WalletService } from 'src/app/pages/wallets/service/wallet.service';
import { ProximaxProvider } from 'src/app/providers/proximax.provider';
import { environment } from '../../../../../environments/environment'

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.page.html',
  styleUrls: ['./account-detail.page.scss'],
})
export class AccountDetailPage implements OnInit {
  formAccount: FormGroup;
  alfaNumberPattern = '^[a-zA-Z0-9]+$';
  address: string;
  publicKey: string;
  privateKey: string;
  showPrivate: boolean;
  showPasword: boolean;
  password: any;
  account: any;
  constructor(
    public formBuilder: FormBuilder,
    public walletService: WalletService,
    private proximaxProvider: ProximaxProvider,
    private clipboardService: ClipboardService,
    public toastController: ToastController,
    private storage: Storage,
  ) { }

  ngOnInit() {
    this.account = this.walletService.current;
    this.address = this.account.address
    this.showPasword = true;
    this.showPrivate = false;
    this.createForm();
    this.generatePublicKey(this.account);
  }

  createForm() {
    this.formAccount = this.formBuilder.group({
      address: [this.address],
      publicKey: [this.publicKey],
      password: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      privateKey: [this.privateKey]
    });
  }

  generatePublicKey(data) {
    this.storage.get('pin').then(async (pin) => {
      const password = this.proximaxProvider.createPassword(pin);
      this.password = pin;
      const PrivateKey = this.proximaxProvider.decryptPrivateKey(password, data.encrypted, data.iv);
      this.privateKey = PrivateKey;
      const publicAccount = this.walletService.getPublicAccountFromPrivateKey(PrivateKey, environment.network);
      this.publicKey = publicAccount.publicKey
      this.formAccount.patchValue({
        publicKey: this.publicKey
      })
    });
  }

  async showPrivateKey(form) {
    console.log(form.password)
    if (form.password == '') {
      const toast = await this.toastController.create({
        message: 'Password required',
        duration: 3000
      });
      toast.present();
    } else {
     if(form.password === this.password ){
      console.log('password sucess')
      this.formAccount.patchValue({
        privateKey: this.privateKey
      })
      this.showPrivate = true;
      this.showPasword = false;
      } else {
        const toast = await this.toastController.create({
          message: 'wrong password',
          duration: 3000
        });
        toast.present();
      }  
    }
  }

  hidePrivateKey() {
    this.showPrivate = false;
    this.showPasword = true;
    this.formAccount.patchValue({
      password:'',
      privateKey:''
    })
  }

  async copyMessage(valor, type) {
    this.clipboardService.copyFromContent(valor);
    const toast = await this.toastController.create({
      message: 'Copied '+ `${type}`,
      duration: 3000
    });
    toast.present();
  }
}
