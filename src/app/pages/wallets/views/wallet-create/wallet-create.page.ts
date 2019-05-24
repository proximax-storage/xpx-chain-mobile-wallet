import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ProximaxProvider } from '../../../../providers/proximax.provider';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../auth/service/auth.service';
import { WalletService } from '../../service/wallet.service'

@Component({
  selector: 'app-wallet-create',
  templateUrl: './wallet-create.page.html',
  styleUrls: ['./wallet-create.page.scss'],
})
export class WalletCreatePage implements OnInit {
  formWallets: FormGroup;
  checkbox: boolean;
  user: string;
  imgen: string;
  alfaNumberPattern = '^[a-zA-Z0-9 ]+$';
  numberPattern = '^[0-9]+$';
  constructor(
    public formBuilder: FormBuilder,
    private storage: Storage,
    public toastController: ToastController,
    private nav: NavController,
    private proximaxProvider: ProximaxProvider,
    public authService: AuthService,
    public walletService: WalletService,
  ) { }

  ngOnInit() {
    this.createForm();
    // this.checkbox = false;
  }

  addImg(val) {
    if (val === 1) {
      this.imgen = 'background-green'
    } else if (val === 2) {
      this.imgen = 'background-orange'
    } else if (val === 3) {
      this.imgen = 'background-blue'
    } else {
      this.imgen = 'background-yellow'
    }
    this.formWallets.patchValue({
      img:this.imgen
    })
    console.log('img', this.imgen)
  }

  createForm() {
    this.formWallets = this.formBuilder.group({
      img: ['', [Validators.required]],
      walletname: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      checkbox: [false],
      privateKey: ['', [Validators.pattern(this.alfaNumberPattern)]],
    });
  }

  onSubmit(form) {
    this.user = this.authService.user;
    this.storage.get('pin').then(async (val) => {

      if (val === form.password) {
        const pin = val;
        const password = this.proximaxProvider.createPassword(pin);
        this.storage.get('wallets'.concat(this.user)).then((wallet) => {
          console.log('datos de forms', form);
          if (form.checkbox === true) {
            if (form.privateKey !== '' || form.privateKey !== null || form.privateKey !== undefined) {
              const walletPrivatekey = this.walletService.createAccountFromPrivateKey(form.img, form.walletname, password, form.privateKey, environment.network)
              if (wallet === null) {
                this.storage.set('wallets'.concat(this.user), [walletPrivatekey]);
              } else {
                wallet.push(walletPrivatekey);
                this.storage.set('wallets'.concat(this.user), wallet);
              }
              this.formWallets.reset();
              this.walletService.use(walletPrivatekey, true);
              this.nav.navigateRoot(['/congratulations']);
              console.log('se importa una cuenta nueva');
              
            } else {
              console.log('.....................errrrorrrrrr');
            }
          } else {
            const walletSimple = this.walletService.createSimpleWallet(form.img, form.walletname, password, environment.network);
            if (wallet === null) {
              this.storage.set('wallets'.concat(this.user), [walletSimple]);
            } else {
              wallet.push(walletSimple);
              this.storage.set('wallets'.concat(this.user), wallet);
            }
            this.formWallets.reset({});
            this.walletService.use(walletSimple, false);
            this.nav.navigateRoot(['/congratulations']);
            console.log('se crea la cuenta nueva');
          }
        });
      } else {
        const toast = await this.toastController.create({
          message: 'Incorrect password.',
          duration: 3000
        });
        toast.present();
      }
    });
  }

  updateCucumber(e) {
    this.checkbox = !this.checkbox;
    console.log('eeeeeeeeee', this.checkbox);
    if (this.checkbox === false) {
      console.log('limpieza');
    }
  }
}
