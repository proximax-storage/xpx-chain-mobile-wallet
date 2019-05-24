import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { WalletService } from '../../service/wallet.service'
import { ProximaxProvider } from 'src/app/providers/proximax.provider';

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
    public toastController: ToastController,
    public walletService: WalletService,
    private proximaxProvider: ProximaxProvider,
  ) { }

  ngOnInit() {
    this.init();
    this.show = false;
  }

  init() {
    this.storage.get('pin').then(async (val) => {
      const password = this.proximaxProvider.createPassword(val);
      this.wallet = this.walletService.current;
      this.address = this.wallet.address;
      this.import = this.walletService.import;
      this.privatekey = this.proximaxProvider.decryptPrivateKey(password, this.wallet.encrypted , this.wallet.iv);
    });
  }
  
  async copyMessage(valor, type) {
    const toast = await this.toastController.create({
      message: 'Copied '+ `${type}`,
      duration: 3000
    });
    toast.present();
  }

  showPrivateKey() {
    this.show = !this.show;
  }
}
