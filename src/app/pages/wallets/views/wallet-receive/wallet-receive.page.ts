import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { WalletService } from '../../service/wallet.service';

@Component({
  selector: 'app-wallet-receive',
  templateUrl: './wallet-receive.page.html',
  styleUrls: ['./wallet-receive.page.scss'],
})
export class WalletReceivePage implements OnInit {
  wallet: any;

  constructor(
    private walletService: WalletService,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.wallet = this.walletService.current;
  }

  async copyAddress(address) {
    const toast = await this.toastController.create({
      message: 'Copied address.',
      duration: 3000
    });
    toast.present();
  }

  shareAddress(address) {
 
  }

}
