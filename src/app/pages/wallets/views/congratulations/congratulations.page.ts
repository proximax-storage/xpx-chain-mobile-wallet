import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ClipboardService } from 'ngx-clipboard';
import { WalletService } from '../../service/wallet.service'
import { ProximaxProvider } from 'src/app/providers/sdk/proximax.provider';
import { ToastProvider } from 'src/app/providers/toast/toast.provider';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/pages/auth/service/auth.service';

@Component({
  selector: 'app-congratulations',
  templateUrl: './congratulations.page.html',
  styleUrls: ['./congratulations.page.scss'],
})
export class CongratulationsPage implements OnInit {
  wallet: any;
  import: any;
  privatekey: any;
  show: boolean;
  address: any;

  constructor(
    private storage: Storage,
    private clipboardService: ClipboardService,
    private nav: NavController,
    public walletService: WalletService,
    private proximaxProvider: ProximaxProvider,
    private toastProvider: ToastProvider,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.init();
    this.show = false;
  }

  init() {
      const pin = this.authService.pin
      const password = this.proximaxProvider.createPassword(pin);
      this.wallet = this.walletService.current;
      this.address = this.wallet.address;
      this.import = this.walletService.import;
      const privatekey = this.proximaxProvider.decryptPrivateKey(password, this.wallet.encrypted , this.wallet.iv);
      this.privatekey = privatekey.toUpperCase();
  }
  
  copyMessage(valor, type) {
    this.clipboardService.copyFromContent(valor);
    this.toastProvider.showToast('Copied '+ `${type}`)
  }

  cancel() {
    this.nav.navigateRoot(`/wallets`);
  }
 
  showPrivateKey() {
    this.show = !this.show;
  }
}
