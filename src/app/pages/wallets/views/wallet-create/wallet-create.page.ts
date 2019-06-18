import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ProximaxProvider } from '../../../../providers/sdk/proximax.provider';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../auth/service/auth.service';
import { WalletService } from '../../service/wallet.service'
import { ToastProvider } from 'src/app/providers/toast/toast.provider';


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
  alfaNumberPatternP  = '^[a-zA-Z0-9 *#$.&]+$';
  numberPattern = '^[0-9]+$';
  n1: string;
  n2: string;
  n3: string;
  n4: string;
  constructor(
    public formBuilder: FormBuilder,
    private storage: Storage,
    private nav: NavController,
    private proximaxProvider: ProximaxProvider,
    public authService: AuthService,
    public walletService: WalletService,
    private toastProvider: ToastProvider
  ) { }

  ngOnInit() {
    this.createForm();
  }

  addImg(val) {
    if (val === 1) {
      this.imgen = 'background-green';
      this.n1 = 'activate'; this.n2 = ''; this.n3 = ''; this.n4 = '';
    } else if (val === 2) {
      this.imgen = 'background-orange'
      this.n1 = ''; this.n2 = 'activate'; this.n3 = ''; this.n4 = '';
    } else if (val === 3) {
      this.imgen = 'background-blue'
      this.n1 = ''; this.n2 = ''; this.n3 = 'activate'; this.n4 = '';
    } else {
      this.imgen = 'background-yellow'
      this.n1 = ''; this.n2 = ''; this.n3 = ''; this.n4 = 'activate';
    }
    this.formWallets.patchValue({
      img: this.imgen
    })
  }

  createForm() {
    this.formWallets = this.formBuilder.group({
      img: ['', [Validators.required]],
      walletname: ['', [Validators.required, Validators.pattern(this.alfaNumberPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.alfaNumberPatternP)]],
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
            if (form.privateKey !== '' && form.privateKey !== null && form.privateKey !== undefined) {
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
        this.toastProvider.showToast('Incorrect password.')
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

  scanqr() {
    console.log('scan Qr');
    // Optionally request the permission early

  }
}
