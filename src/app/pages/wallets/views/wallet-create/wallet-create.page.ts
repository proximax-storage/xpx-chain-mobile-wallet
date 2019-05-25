import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
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
  n1: string;
  n2: string;
  n3: string;
  n4: string;
  constructor(
    public formBuilder: FormBuilder,
    private storage: Storage,
    public toastController: ToastController,
    private nav: NavController,
    private qrScanner: QRScanner,
    private proximaxProvider: ProximaxProvider,
    public authService: AuthService,
    public walletService: WalletService,
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

  scanqr() {
    console.log('scan Qr');
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });
          this.qrScanner.show();
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
}
